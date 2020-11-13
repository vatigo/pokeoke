import React, {useState, createContext, useEffect} from 'react';

export const FavContext = createContext();

let initialvalue = () => {
    let value = window.localStorage.getItem("fav-pokemon");
    console.log(value);
    return ((value!=null)?JSON.parse(value):[]);
  };

export const FavProvider = (props) => {
    const [favorites, setFavorites] = useState(initialvalue);

    return <FavContext.Provider value={[favorites,setFavorites]}>{props.children}</FavContext.Provider>;
}