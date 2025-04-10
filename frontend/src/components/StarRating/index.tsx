const StarRating = ({ rating, ratingCt }: { rating: number, ratingCt: number }) => {
    return <div>
        Rating: {rating}
        Rating Count: {ratingCt}
    </div>
}

export default StarRating