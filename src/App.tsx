import React, { useCallback, useEffect, useRef } from 'react';
import { GameOfLife } from './GameOfLife';
import '@emotion/styled'
import styled from '@emotion/styled';

function App() {
    const gol = useRef<GameOfLife>(new GameOfLife())
    const canvasRef = useCallback(canvas => {
        if (canvas !== null) {
            gol.current.init(canvas)
        }
    }, []);

    useEffect(() => {
        if (gol.current && gol.current.isInitialized()) {
            gol.current.resizeBoardAndRedraw();

            const handleResize = () => {
                gol.current.resizeBoardAndRedraw();
            }

            const interval = setInterval(() => {
                gol.current.animateStep();
            }, 200);

            window.addEventListener('resize', handleResize)

            return () => {
                clearInterval(interval)
                window.removeEventListener('resize', handleResize)
            }
        }
    }, []);

    return (
        <>
            <FullScreenCanvas ref={canvasRef} onClick={e => gol.current ? gol.current.gameOnClick(e) : undefined} />
            <Container>
                <AboutCard>
                    <ContactSpan href={"https://www.github.com/cedarbaum"} target={"_blank"}>@cedarbaum</ContactSpan>
                </AboutCard>
            </Container>
        </>
    );
}

const Container = styled.div({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const AboutCard = styled.div({
    padding: '3em',
    backgroundColor: 'white',
    zIndex: 100
})

const ContactSpan = styled.a({
    fontSize: '3em',
    '@media (min-width: 720px)': {
        fontSize: '5em'
    },
    color: 'black',
    textDecoration: 'none'
})

const FullScreenCanvas = styled.canvas({
    position: 'absolute',
    width: '100%',
    height: '100%'
})

export default App;
