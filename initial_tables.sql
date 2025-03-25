-- clearing all tables
-- drop table if exists users cascade;
-- drop table if exists puzzles cascade;
-- drop table if exists attempts cascade;
-- drop table if exists minis cascade;
-- drop table if exists connections cascade;
-- drop table if exists ratings cascade;
-- drop trigger if exists insert_puzzle_trigger on puzzles;
-- drop function if exists insert_puzzle;
-- drop trigger if exists update_puzzle_trigger on puzzles;
-- drop function if exists update_puzzle;
-- drop trigger if exists compute_score_trigger on attempts;
-- drop function if exists compute_score;
-- drop view if exists most_played_puzzles;
-- drop view if exists most_popular_puzzles;
-- drop view if exists most_recent_puzzles;

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
	
	constraint rating_constraint check (rating >= 0 and rating <= 5),
	primary key (user_id, puzzle_id)
);

create table if not exists Attempts(
	user_id int references Users(user_id) on delete cascade, 
	puzzle_id int references Puzzles(puzzle_id) on delete cascade, 
	attempt_num serial,

	score int, -- computed based on factors below, lower is better
	start_at timestamp not null default now(),
	finish_at timestamp,
	tries int not null default 0,

	primary key(user_id, puzzle_id, attempt_num),
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

-- Compute the score when an attempt is made
create or replace function compute_score() returns trigger as $$
begin
	-- Did not finish the puzzle
	if new.finish_at is null then
		new.score := new.tries + 1000;
		return new;
	end if;

	-- Solved the puzzle
	new.score := new.tries + (extract(epoch from new.finish_at - new.start_at)::int);
	return new;
end;
$$ language plpgsql;

create trigger compute_score_trigger
before insert or update on Attempts
for each row
execute function compute_score();

-- Procedures

-- Finish a puzzle attempt
create or replace procedure finish_attempt(
	p_user_id int,
	p_puzzle_id int,
	p_attempt_num int,
	p_tries int
)
language plpgsql
as $$
begin
	update Attempts
	set finish_at = now(), tries = p_tries
	where user_id = p_user_id and puzzle_id = p_puzzle_id and attempt_num = p_attempt_num and finish_at is null;
end;
$$;

-- Views

-- Most played puzzles
create view most_played_puzzles as
select A.puzzle_id, P.puzzle_name, A.num_attempts
from (
	select puzzle_id, count(*) as num_attempts
	from Attempts
	group by puzzle_id
) as A 
join Puzzles as P on A.puzzle_id = P.puzzle_id
order by num_attempts desc;

-- Most popular puzzles
create view most_popular_puzzles as
select R.puzzle_id, P.puzzle_name, R.avg_rating
from (
	select puzzle_id, avg(rating) as avg_rating
	from Ratings
	group by puzzle_id
) as R
join Puzzles as P on R.puzzle_id = P.puzzle_id
order by avg_rating desc;

-- Most recent puzzles
create view most_recent_puzzles as
select puzzle_id, puzzle_name, updated_at
from Puzzles
order by updated_at desc;

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

call finish_attempt(1, 1, 1, 1);
call finish_attempt(2, 1, 2, 5);
call finish_attempt(3, 1, 3, 10);
call finish_attempt(4, 2, 4, 20);

select * from Attempts;