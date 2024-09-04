'use client'
import { useState, useEffect } from "react";
import styled from "styled-components";
import "./style.sass"

interface Table {
    id: string;
    name: string;
}

const Container = styled.div`
  margin: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px

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
    }, []); // El array vacío como segundo argumento hace que este efecto se ejecute solo una vez al montar el componente

    return (
        <main className="ml-60">
            <Container>
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div key={table.id} className="table"><h1 >{table.name}</h1></div> 
                    ))
                ) : (
                    <p>No hay mesas disponibles</p>
                )}
            </Container>
        </main>
    )
}

                    