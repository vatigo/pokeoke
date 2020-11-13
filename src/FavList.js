import React, {useContext} from 'react';
import {FavContext} from './FavContext';

const FavList = () => {

    const [favorites, setFavorites] = useContext(FavContext);

    return(
        <div>
            {favorites.map(favorite => (
                <h1>{favorite.name}</h1>
            ))}
        </div>
    );
};

export default FavList;