import { useEffect, useRef, useState } from 'react';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
import './App.css';


function Card( {pokemon, index, callback} ) {


  const [pos, setPos] = useState('static');
  const [Y, setY] = useState(0);
  const [X, setX] = useState(0);
  const [flavorText, setFlavor] = useState("");
  const [genusText, setGenus] = useState("");
  const [cardOpen, setCardOpen] = useState("");
  const cardRef = useRef(null);

  const openCloseCard = (e) => {

    if (genusText===""){
      fetch(pokemon.species.url).then(response => {
        return response.json();        
      }).then(speciesInfo => {
        console.log(speciesInfo);
        const data = speciesInfo;
        console.log(data);
        const flavor_texts = data.flavor_text_entries;
        flavor_texts.forEach(element => {
          if (element.language.name=="en")
            setFlavor(element.flavor_text);
        });

        const genus_text = data.genera;
        genus_text.forEach(element => {
          if (element.language.name=="en")
            setGenus(element.genus);
        });
      });
    }

    let offset = getElementOffset(e.currentTarget);
    let delay = 400;
    if (cardOpen==="")
      delay = 10;
    setTimeout(() => {
      if (cardOpen==="card-open")
        setCardOpen("");
      else if (cardOpen==="")
        setCardOpen("card-open");
      
  }, delay);
    
    if (cardOpen==="")
    {
      callback("overlay-modal");
      setPos('fixed');
      setX(offset.left-20);
      setY(offset.top-20);
    } else {
      setX(offset.left-20);
      setY(offset.top-20);
      callback("overlay");
      setTimeout(() => {
        setPos('static');
    }, 500);
    }
    setCardOpen("card-animating");
  }

  useEffect(()=>{
    let offset = getElementOffset(cardRef.current);
    console.log(cardRef.current);
    setX(offset.left);
    setY(offset.top);
  }, [cardRef])

  function getElementOffset(element)
  {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top - de.clientTop;// + window.pageYOffset - de.clientTop;
    var left = box.left - de.clientLeft;// + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
  }

  function Type(types) {
    if (types.length>=2) {    
      return <div><span className={"type " + types[0].type.name+"_1"}>{types[0].type.name}</span><span className={"type "+types[1].type.name+"_1"}>{types[1].type.name}</span></div>;  
    }  
    return <span className={"type " + types[0].type.name+"_1"}>{types[0].type.name}</span>;
  }

  const data = [
    {
      data: {
        hp: pokemon.stats[0].base_stat/250,
        a: pokemon.stats[1].base_stat/155,
        d: pokemon.stats[2].base_stat/185,
        sa: pokemon.stats[3].base_stat/155,
        sd: pokemon.stats[4].base_stat/155
      },
      meta: { color: 'blue' }
    }
  ];

const captions = {
    // columns
    hp: "HP",
    a: "Atk",
    d: "Def",
    sa: "Sp. Atk",
    sd: "Sp. Def"
  };

  return (
        <div className={"pokemon-card-container " + cardOpen} onClick={openCloseCard} key={pokemon.id}>
        <div className="pokemon-card" ref={cardRef} style={{ position: pos, top: Y, left:X}}>
          <div className={
            "pokemon-card-inner "+ (pokemon.types!=null?pokemon.types[0].type.name+"_1":"") +
             " " + ((pokemon.types!=null && pokemon.types.length>=2)?pokemon.types[1].type.name+"_2 bg-gradient":(pokemon.types!=null?pokemon.types[0].type.name+"_2 bg-gradient_2":""))
            }>
          <div className="pokemon-card-front">
          <h3 className="pokemon-name">{ "#" + (pokemon.id!=null?pokemon.id:index+1) + " " + pokemon.name }</h3>
          <img className="pokemon-image" alt={pokemon.name} src={pokemon.sprites!=null ? pokemon.sprites.other.dream_world.front_default : "nothing.jpg"} />
          </div>
          <div className="pokemon-card-back">
          <button>Add to fav</button>
            <h3 className="pokemon-name">{ "#" + (pokemon.id!=null?pokemon.id:index+1) + " " + pokemon.name }</h3>
            <table className="pokemon-general-info">
              <tr><td className="label genus" colSpan="2">{genusText}</td></tr>
              <tr><td className="label">Type</td><td className="value">{Type(pokemon.types)}              
              </td></tr>
              <tr>
          <td className="label">Height</td><td className="value">{pokemon.height/10+"m"}</td>
              </tr>
              <tr>
          <td className="label">Weight</td><td className="value">{pokemon.weight/10+"kg"}</td>
              </tr>
              <tr><td className="value flavor" colSpan="2">{flavorText}</td></tr>
            </table>
            <div className="radar-container"><RadarChart
                  captions={captions}
                  data={data}
                  size={450} />
            </div>
          </div>
          </div>
        </div>
        </div>
      )
}

export default Card;