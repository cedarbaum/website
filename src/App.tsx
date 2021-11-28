import React, { useCallback, useEffect, useRef } from 'react';
import { GameOfLife } from './GameOfLife';
import '@emotion/styled'
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons'

interface AnnotationProps {
    level: number,
    color: string
}

const colors = [
    '#B983FF',
    '#94B3FD',
    '#94DAFF'
]

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
            <FullScreenCanvas ref={canvasRef} onClick={e => gol.current && gol.current.isInitialized() ? gol.current.gameOnClick(e) : undefined} />
            <Container>
                <AboutCard>
                    <PlainText>
                        <Word>sam</Word>
                        <Word>@</Word>
                        <Word>cedarbaum.io</Word>
                    </PlainText>
                    <AnnotatedSet>
                        <Word>sam<AnnotationBeginning color={colors[0]} level={0}/></Word>
                        <Word>@<Annotation color={colors[0]} level={0}/></Word>
                        <Word>cedarbaum<Annotation color={colors[0]} level={0}/></Word>
                        <Word>.io<AnnotationEnd color={colors[0]} level={0}/></Word>
                    </AnnotatedSet>
                    <AnnotatedSet>
                        <Word>sam</Word>
                        <Word>@<AnnotationBeginning color={colors[1]} level={1}/></Word>
                        <Word>cedarbaum<AnnotationEnd color={colors[1]} level={1}/></Word>
                        <Word>.io</Word>
                    </AnnotatedSet>
                    <AnnotatedSet>
                        <Word>sam</Word>
                        <Word>@</Word>
                        <Word>cedarbaum<AnnotationBeginning color={colors[2]} level={2} /></Word>
                        <Word>.io<AnnotationEnd color={colors[2]} level={2} /></Word>
                    </AnnotatedSet>
                    <IconContainer>
                        <a href={"mailto:sam@cedarbaum.io"}>
                            <FontAwesomeIcon icon={faEnvelope} size={'2x'} color={colors[0]} />

                        </a>
                        <a href={"https://github.com/cedarbaum"} target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faGithub} size={'2x'} color={colors[1]} />
                        </a>
                        <a href={"https://cedarbaum.io"} target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faGlobe} size={'2x'} color={colors[2]} />
                        </a>
                    </IconContainer>
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
    position: 'relative',
    padding: '48px',
    zIndex: 100,
    borderRadius: '5px',
    backgroundColor: 'white',
    '@supports (backdropFilter: blur(20px))': {
        backgroundColor: 'rgba(255, 255, 255, .15)',
        backdropFilter: 'blur(20px)',
    }
})

const PlainText = styled.div({
    whiteSpace: 'nowrap',
    position: 'static',
    fontSize: '3em',
    '@media (min-width: 720px)': {
        fontSize: '5em'
    },
    color: 'black',
    textDecoration: 'none',
    zIndex: 1
})

const AnnotatedSet = styled(PlainText)({
    top: '48px',
    zIndex: 0,
    position: 'absolute',
    visibility: 'hidden',
})

const Word = styled.div({
    display: 'inline-block',
})

const Annotation = styled.div<AnnotationProps>(props => ({
    visibility: 'visible',
    position: 'relative',
    backgroundColor: props.color,
    width: 'calc(~"100% + 0.5rem")',
    height: '0.25rem',
    top: `${0.25 + 0.75 * props.level}rem`,
    left: '-0.25rem'
}))

const AnnotationBeginning = styled(Annotation)({
    left: 0 ,
    width: 'calc(~"100% + 0.25rem")',
})

const AnnotationEnd = styled(Annotation)({
    width: 'calc(~"100% + 0.25rem")',
})

const IconContainer = styled.div({
    margin: 'auto',
    maxWidth: '200px',
    paddingTop: '4em',
    display: 'flex',
    justifyContent: 'space-between',
})

const FullScreenCanvas = styled.canvas({
    position: 'absolute',
    width: '100%',
    height: '100%'
})

export default App;
