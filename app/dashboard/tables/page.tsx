'use client'
import { useState, useEffect } from "react";
import styled from "styled-components";
import "./style.sass";

interface Table {
  id: string;
  name: string;
}

const Container = styled.div`
  margin-left:220px;
  margin-top: 20px;
  padding:20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
`;

const NavBar = styled.nav`
  margin-left: 220px;
  background-color: #f8f9fa;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 10px 20px;
  background-color: ${props => (props.disabled ? "#cccccc" : "#007bff")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${props => (props.disabled ? "#cccccc" : "#0056b3")};
  }
`;

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    // Llamada a la API para obtener las mesas
    fetch('http://localhost:8001/tables')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          console.error("Formato de datos incorrecto");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addTable = () => {
    const newTable: Table = { id: `${tables.length + 1}`, name: `${tables.length + 1}` };

    // Hacer POST al servidor para añadir la nueva mesa
    fetch('http://localhost:8001/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTable),
    })
      .then((response) => response.json())
      .then((data) => {
        // Actualizar el estado local con la nueva mesa
        setTables([...tables, data]);
      })
      .catch((error) => console.error('Error al añadir mesa:', error));
  };

  const removeTable = () => {
    if (tables.length > 0) {
      const lastTable = tables[tables.length - 1];

      // Hacer DELETE al servidor para eliminar la última mesa
      fetch(`http://localhost:8001/tables/${lastTable.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            // Actualizar el estado local removiendo la última mesa
            setTables(tables.slice(0, -1));
          } else {
            console.error('Error al eliminar la mesa');
          }
        })
        .catch((error) => console.error('Error al eliminar mesa:', error));
    }
  };

  return (
    <>
      <NavBar>
        <h1>Mesas</h1>
        <div>
          <Button onClick={addTable}>Añadir Mesa</Button>
          <Button onClick={removeTable} disabled={tables.length === 0} style={{ marginLeft: '10px' }}>
            Eliminar Mesa
          </Button>
        </div>
      </NavBar>
      <Container>
        {tables.length > 0 ? (
          tables.map((table) => (
            <div key={table.id} className="table">
              <h2>{table.name}</h2>
            </div>
          ))
        ) : (
          <h2>No hay mesas disponibles</h2>
        )}
      </Container>
    </>
  );
}
