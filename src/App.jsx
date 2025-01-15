import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./App.css";

export default function App() {
  const [dadosEstados, setDadosEstados] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [municipios, setMunicipios] = React.useState({});

  React.useEffect(() => {
    fetch(`https://brasilapi.com.br/api/ibge/uf/v1`)
      .then((response) => response.json())
      .then((json) => {
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        }).then(() => {
          setLoading(false);
          setDadosEstados(json);
          json.forEach((el) => {
            fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${el.sigla}`)
              .then((response) => response.json())
              .then((infoMunicipios) => {
                const limitedMunicipios = infoMunicipios.slice(0, 20);
                setMunicipios((prevMunicipios) => ({
                  ...prevMunicipios,
                  [el.sigla]: limitedMunicipios,
                }));
              });
          });
        });
      });
  }, []);

  const handleClick = (uf) => {};

  return (
    <div className="caixa-principal">
      <div className="caixa-lista-municipios">
        {loading ? (
          <>
            <CircularProgress />
            <br></br>
            <p>Carregando...</p>
          </>
        ) : null}

        {dadosEstados.map((dado) => (
          <Accordion key={dado.sigla} onClick={() => handleClick(dado.sigla)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>{dado.nome}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <ul>
                  {municipios[dado.sigla]
                    ? municipios[dado.sigla].map((item, index) => (
                        <li key={index}>{item.nome}</li>
                      ))
                    : "Nada encontrado"}
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
