-- clearing all tables
drop table if exists users cascade;
drop table if exists puzzles cascade;
drop table if exists attempts cascade;
drop table if exists minis cascade;
drop table if exists connections cascade;
drop table if exists ratings cascade;
drop trigger if exists insert_puzzle_trigger on puzzles;
drop function if exists insert_puzzle;
drop trigger if exists update_puzzle_trigger on puzzles;
drop function if exists update_puzzle;
drop trigger if exists compute_score_trigger on attempts;
drop function if exists compute_score;
drop view if exists most_played_puzzles;
drop view if exists most_popular_puzzles;
drop view if exists most_recent_puzzles;
drop view if exists puzzle_stats;
drop view if exists user_stats;
drop view if exists attempt_stats;
drop view if exists rating_stats;

create table if not exists Users(
	user_id serial primary key, 
	username varchar(255) unique not null, 
	password varchar(255) not null, 
	is_admin boolean not null
);

create table if not exists Puzzles(
	puzzle_id serial primary key,
	created_user_id int references Users(user_id) on delete cascade,
	puzzle_name varchar(255) not null,
	updated_at timestamp not null default now(),
	puzzle_type varchar(255) not null,

	constraint puzzle_type_constraint check (puzzle_type = 'mini' or puzzle_type = 'connections')
);

create table if not exists Ratings(
	user_id int references Users(user_id) on delete cascade,
	puzzle_id int references Puzzles(puzzle_id) on delete cascade, 
	rating int,
	updated_at timestamp not null default now(),
	
	constraint rating_constraint check (rating >= 0 and rating <= 5),
	primary key (user_id, puzzle_id)
);

create table if not exists Attempts(
	user_id int references Users(user_id) on delete cascade, 
	puzzle_id int references Puzzles(puzzle_id) on delete cascade, 
	
	start_at timestamp not null default now(),
	finish_at timestamp,
	attempt_num int not null default 0,
	solved boolean not null default false,
	score int not null default 0,

	primary key(user_id, puzzle_id),
	constraint finish_at_constraint check (finish_at is null or finish_at >= start_at)
);

-- mini subclass
create table if not exists Minis (
	puzzle_id int primary key references Puzzles(puzzle_id) on delete cascade,
	
	-- The mini is a grid of 5x5 letters, like a crossword
	solution char(25) not null default '',
	-- Gaps will have a space in the spots to indicate it is a gap (i.e. no characters there)
	gaps char(25) not null default '',

	-- Crossword clues
	across1 varchar(255) not null default '',
	across2 varchar(255) not null default '',
	across3 varchar(255) not null default '',
	across4 varchar(255) not null default '',
	across5 varchar(255) not null default '',

	down1 varchar(255) not null default '',
	down2 varchar(255) not null default '',
	down3 varchar(255) not null default '',
	down4 varchar(255) not null default '',
	down5 varchar(255) not null default ''
);

-- connections subclass
create table if not exists Connections (
	puzzle_id int primary key references Puzzles(puzzle_id) on delete cascade,

	-- Connections always have 16 words, in 4 categories.
	c1 varchar(255) not null default '',
	c1w1 varchar(30) not null default '',
	c1w2 varchar(30) not null default '',
	c1w3 varchar(30) not null default '',
	c1w4 varchar(30) not null default '',
	c2 varchar(255) not null default '',
	c2w1 varchar(30) not null default '',
	c2w2 varchar(30) not null default '',
	c2w3 varchar(30) not null default '',
	c2w4 varchar(30) not null default '',
	c3 varchar(255) not null default '',
	c3w1 varchar(30) not null default '',
	c3w2 varchar(30) not null default '',
	c3w3 varchar(30) not null default '',
	c3w4 varchar(30) not null default '',
	c4 varchar(255) not null default '',
	c4w1 varchar(30) not null default '',
	c4w2 varchar(30) not null default '',
	c4w3 varchar(30) not null default '',
	c4w4 varchar(30) not null default ''
);

-- Triggers

-- Stub the new puzzle subclass when a puzzle is created
create or replace function insert_puzzle() returns trigger as $$
begin
	if new.puzzle_type = 'mini' then
		insert into Minis (puzzle_id)
		values (new.puzzle_id);
	else
		insert into Connections (puzzle_id)
		values (new.puzzle_id);
	end if;
	return new;
end;
$$ language plpgsql;

create trigger insert_puzzle_trigger
after insert on Puzzles
for each row
execute function insert_puzzle();

-- Update the updated_at timestamp when a puzzle is updated
create or replace function update_puzzle() returns trigger as $$
begin
	update Puzzles
	set updated_at = now()
	where puzzle_id = new.puzzle_id;
	return new;
end;
$$ language plpgsql;

create trigger update_puzzle_trigger
before update on Puzzles
for each row
execute function update_puzzle();

-- Views

-- Puzzles with Stats
create view puzzle_stats as
select P.puzzle_id, P.puzzle_name, P.updated_at, P.puzzle_type,
		created_user_id, U.username,
		(select count(*) from Attempts A where A.puzzle_id = P.puzzle_id and A.solved = true) as solved_ct,
		(select count(*) from Ratings R where R.puzzle_id = P.puzzle_id) as rating_ct,
		(select avg(rating) from Ratings R where R.puzzle_id = P.puzzle_id) as rating_avg
from Puzzles P
join Users as U on P.created_user_id = U.user_id
order by updated_at desc;

-- Attempts
create view attempt_stats as
select A.user_id, A.puzzle_id, A.start_at, A.finish_at, A.attempt_num, A.solved, A.score,
		U.username, P.puzzle_name
from Attempts A
join Users as U on A.user_id = U.user_id
join Puzzles as P on A.puzzle_id = P.puzzle_id
order by A.start_at desc;

-- Ratings
create view rating_stats as
select R.user_id, R.puzzle_id, R.rating, R.updated_at,
		U.username, P.puzzle_name, P.puzzle_type
from Ratings R
join Users as U on R.user_id = U.user_id
join Puzzles as P on R.puzzle_id = P.puzzle_id
order by R.updated_at desc;

-- User stats
create view user_stats as
select
		u.user_id, u.username, u.is_admin,
		(select count(*) as puzzle_ct from puzzles p where p.created_user_id = u.user_id),
		(select count(*) as solved_ct from attempts a where a.user_id = u.user_id and a.solved = true),
		(select count(*) as rating_ct from ratings r where r.user_id = u.user_id)
from users u
order by puzzle_ct;

-- Dummy data
insert into Users (username, password, is_admin) values
('user1', 'password1', false),
('user2', 'password2', false),
('admin1', 'adminpassword1', true),
('admin2', 'adminpassword2', true);

insert into Puzzles (created_user_id, puzzle_name, puzzle_type) values
(1, 'Mini Puzzle 1', 'mini'),
(2, 'Connections Puzzle 1', 'connections'),
(1, 'Mini Puzzle 2', 'mini'),
(2, 'Connections Puzzle 2', 'connections');

insert into Ratings (user_id, puzzle_id, rating) values
(1, 1, 5),
(2, 1, 4),
(3, 1, 5),
(4, 2, 1),
(1, 2, 1),
(3, 2, 1);

insert into Attempts (user_id, puzzle_id) values
(1, 1),
(2, 1),
(3, 1),
(4, 2);

select * from Attempts;