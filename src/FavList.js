import React, {useContext, useState} from 'react';
import {FavContext} from './FavContext';

const FavList = () => {

    const [favorites, setFavorites] = useContext(FavContext);
    const [favbarOpen, setFavbarOpen] = useState(false);

    const removeFavorite = (favorite_id) => {
        //remove pokemon
        if (favorites.some(e => e.id === favorite_id)) {
          setFavorites(() => {
            const newItems = favorites.filter(item => item.id !== favorite_id);
            console.log(newItems);
            window.localStorage.setItem("fav-pokemon", JSON.stringify(newItems));
            return newItems;        
          });
        }
      }

    const toggleFavbar =() => {
        setFavbarOpen(!favbarOpen);
    }

    return(
        <div className="favorites">
            <button className="favorites-open-button" onClick={toggleFavbar}>❤</button>
            <div className={"favorites-list-container " + (favbarOpen?"open":"")}>
                <div className="favorites-title"><button onClick={toggleFavbar} className="close-favorites-button">X</button><h2>Favorites</h2></div>
                {favorites.length>0?(favorites.map(favorite => (
                    <div className="favorite-pokemon-item"  key={"fav"+favorite.id}>
                        <button className="remove-button" onClick={()=>{removeFavorite(favorite.id)}}>−</button>
                        <img className="favorite-icon" src={favorite.sprites.front_default} alt={favorite.name}></img>
                        <span>{favorite.name}</span>
                    </div>
                ))):(<div className="no-favorites">No favorites here yet</div>)}
            </div>
        </div>
    );
};

export default FavList;