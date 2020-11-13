import { useEffect, useState } from 'react';
import Card from './Card'
import './App.css';
import {FavProvider} from './FavContext';
import FavList from './FavList';


function App() {

  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [overlayClass, setOverlay] = useState("overlay");
  const [searchText, setSearchText] = useState("");

  const filterPokemon = () => {
    setFilteredList(pokemonList.filter(pokemon => {
      let value = searchText.toLowerCase().replace(/\s+/g, '');
      return (pokemon.name.includes(value) || pokemon.types[0].type.name.includes(value)  || (pokemon.types.length>1?pokemon.types[1].type.name.includes(value):false ));
    }));
  }

  useEffect(()=>{
    const getAllPokemonList = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      const data = await response.json();
      //console.log(data.results);
      //setPokemonList(data.results);

      const promises = data.results.map(pokemon => {
        return fetch(pokemon.url)
          .then(response=> {
          return response.json()
        });
      });
    
      Promise.all(promises).then(results => {
        const pokemons = results.map(result => result);
        console.log(pokemons);
        setPokemonList(pokemons);
        setFilteredList(pokemons);
      })
    }
    getAllPokemonList();
  }, []);

  const mycallback = (e) => {
    setOverlay(e);
    return; 
  }

  useEffect(filterPokemon,[searchText, pokemonList]);

  useEffect(() => {
    function handleResize() {
      //console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
      document.body.style.width = "auto";
}

    window.addEventListener('resize', handleResize)
  })

  const Search = e => {
    setSearchText(e.target.value);
  }

  const clearSearch = () => {
    setSearchText("");
  }

  return (
    <div className="App">
      <FavProvider>
      <FavList></FavList>
      <div className={overlayClass}></div>
      <div className="search-container">
      <div className="search-box">
        <input className="searchBar" type="text" value={searchText} placeholder="Start typing to search by name or type" onChange={Search}></input>
        {searchText!==""?(<i className="clear" onClick={clearSearch}>&times;</i>):""}
      </div>
      </div>
      <div className="poke-grid">
        {filteredList.map((pokemon,index) => (
          <Card pokemon={pokemon} index={index} key={pokemon.id} callback={mycallback} />
        ))
        }
      </div>
      </FavProvider>
    </div>
  );
}

export default App;
