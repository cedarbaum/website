import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameOfLife } from "./GameOfLife";
import "@emotion/styled";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { DarkModeToggle } from "./DarkModeToggle";
import { usePrefersColorScheme } from "@anatoliygatt/use-prefers-color-scheme";

interface AnnotationProps {
  top?: number | string;
  color: string;
}

interface ThemeProps {
  opacity?: number;
  isDarkMode?: boolean;
}

const COLORS = ["#B983FF", "#94B3FD", "#94DAFF"];

enum Icon {
  Email,
  GitHub,
  Website,
}

const IconToLevelMap: Record<Icon, number> = {
  [Icon.Email]: 0,
  [Icon.GitHub]: 1,
  [Icon.Website]: 2,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  const gol = useRef<GameOfLife>(new GameOfLife());
  const canvasRef = useCallback((canvas) => {
    if (canvas !== null) {
      gol.current.init(canvas);
    }
  }, []);

  const preferredColorScheme = usePrefersColorScheme();
  const [darkModeToggled, setDarkModeToggled] = useState<boolean | undefined>(
    undefined
  );
  const [hoverIcon, setHoverIcon] = useState<Icon | undefined>(undefined);

  const isDarkColorSchemePreferred =
    (preferredColorScheme === "dark" &&
      (darkModeToggled === undefined || darkModeToggled)) ||
    darkModeToggled;
  const golEnabled = !isDarkColorSchemePreferred;

  function getOpacity(icon: Icon): number {
    if (hoverIcon === undefined || icon === hoverIcon) {
      return 1.0;
    }

    return 0.25;
  }

  function getTop(icon: Icon): number | string {
    if (icon === hoverIcon) {
      return '0.5rem';
    }

    const level = IconToLevelMap[icon];
    if (hoverIcon !== undefined && level < IconToLevelMap[hoverIcon]) {
      return `${0.5 + 0.9 * (level + 1)}rem`

    }

    return `${0.5 + 0.9 * level}rem`
  }

  useEffect(() => {
    if (golEnabled && gol.current && gol.current.isInitialized()) {
      gol.current.resizeBoardAndRedraw();

      const handleResize = () => {
        gol.current.resizeBoardAndRedraw();
      };

      const interval = setInterval(() => {
        gol.current.animateStep();
      }, 200);

      window.addEventListener("resize", handleResize);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <>
      <DarkModeToggleContainer>
        <DarkModeToggle
          toggled={isDarkColorSchemePreferred}
          onToggle={(enabled) => setDarkModeToggled(enabled)}
        />
      </DarkModeToggleContainer>
      {golEnabled && (
        <FullScreenCanvas
          ref={canvasRef}
          onClick={(e) =>
            gol.current && gol.current.isInitialized()
              ? gol.current.gameOnClick(e)
              : undefined
          }
        />
      )}
      <Container isDarkMode={isDarkColorSchemePreferred}>
        <AboutCard isDarkMode={isDarkColorSchemePreferred}>
          <PlainText isDarkMode={isDarkColorSchemePreferred}>
            <Word>sam</Word>
            <Word>@</Word>
            <Word>cedarbaum.io</Word>
          </PlainText>
          <AnnotatedSet opacity={getOpacity(Icon.Email)}>
            <Word>
              sam
              <AnnotationBeginning color={COLORS[0]} top={getTop(Icon.Email)} />
            </Word>
            <Word>
              @<Annotation color={COLORS[0]} top={getTop(Icon.Email)} />
            </Word>
            <Word>
              cedarbaum
              <Annotation color={COLORS[0]} top={getTop(Icon.Email)} />
            </Word>
            <Word>
              .io
              <AnnotationEnd color={COLORS[0]} top={getTop(Icon.Email)} />
            </Word>
          </AnnotatedSet>
          <AnnotatedSet opacity={getOpacity(Icon.GitHub)}>
            <Word>sam</Word>
            <Word>
              @<AnnotationBeginning color={COLORS[1]} top={getTop(Icon.GitHub)} />
            </Word>
            <Word>
              cedarbaum
              <AnnotationEnd color={COLORS[1]} top={getTop(Icon.GitHub)} />
            </Word>
            <Word>.io</Word>
          </AnnotatedSet>
          <AnnotatedSet opacity={getOpacity(Icon.Website)}>
            <Word>sam</Word>
            <Word>@</Word>
            <Word>
              cedarbaum
              <AnnotationBeginning color={COLORS[2]} top={getTop(Icon.Website)} />
            </Word>
            <Word>
              .io
              <AnnotationEnd color={COLORS[2]} top={getTop(Icon.Website)} />
            </Word>
          </AnnotatedSet>
          <IconContainer>
            <a
              href={"mailto:sam@cedarbaum.io"}
              onMouseOver={() => setHoverIcon(Icon.Email)}
              onMouseLeave={() => setHoverIcon(undefined)}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                size={"2x"}
                color={COLORS[0]}
              />
            </a>
            <a
              href={"https://github.com/cedarbaum"}
              target="_blank"
              rel="noreferrer"
              onMouseOver={() => setHoverIcon(Icon.GitHub)}
              onMouseLeave={() => setHoverIcon(undefined)}
            >
              <FontAwesomeIcon icon={faGithub} size={"2x"} color={COLORS[1]} />
            </a>
            <a
              href={"https://cedarbaum.io"}
              target="_blank"
              rel="noreferrer"
              onMouseOver={() => setHoverIcon(Icon.Website)}
              onMouseLeave={() => setHoverIcon(undefined)}
            >
              <FontAwesomeIcon icon={faGlobe} size={"2x"} color={COLORS[2]} />
            </a>
          </IconContainer>
        </AboutCard>
      </Container>
    </>
  );
}

const Container = styled.div<ThemeProps>((props) => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: props.isDarkMode ? "black" : "white",
}));

const AboutCard = styled.div<ThemeProps>((props) => ({
  position: "relative",
  padding: "38px",
  "@media (min-width: 720px)": {
    padding: "48px",
  },
  zIndex: 100,
  borderRadius: "5px",
  backgroundColor: props.isDarkMode ? "black" : "white",
  ...(!props.isDarkMode && {
    boxShadow: "0px 0px 8px 1px rgb(0 0 255 / 20%)",
  }),
}));

const PlainText = styled.div<ThemeProps>((props) => ({
  transition: "opacity 0.5s",
  transitionTimingFunction: "ease-in",
  opacity: props.opacity ? props.opacity : 1.0,
  whiteSpace: "nowrap",
  position: "static",
  fontSize: "2em",
  "@media (min-width: 720px)": {
    fontSize: "4em",
  },
  "@media (min-width: 1024px)": {
    fontSize: "5em",
  },
  color: props.isDarkMode ? "white" : "black",
  textDecoration: "none",
  zIndex: 1,
}));

const AnnotatedSet = styled(PlainText)({
  top: "48px",
  zIndex: 0,
  position: "absolute",
  visibility: "hidden",
});

const Word = styled.div({
  display: "inline-block",
});

const Annotation = styled.div<AnnotationProps>((props) => ({
  visibility: "visible",
  position: "relative",
  backgroundColor: props.color,
  width: 'calc(~"100% + 0.5rem")',
  height: "0.5rem",
  top: props.top,
  left: "-0.25rem",
  transition: 'top 0.5s',
}));

const AnnotationBeginning = styled(Annotation)({
  left: 0,
  width: 'calc(~"100% + 0.25rem")',
});

const AnnotationEnd = styled(Annotation)({
  width: 'calc(~"100% + 0.25rem")',
});

const IconContainer = styled.div({
  margin: "auto",
  maxWidth: "200px",
  paddingTop: "4.5em",
  display: "flex",
  justifyContent: "space-between",
});

const FullScreenCanvas = styled.canvas({
  position: "absolute",
  width: "100%",
  height: "100%",
});

const DarkModeToggleContainer = styled.div({
  position: "fixed",
  right: 0,
  margin: "2.5em",
  zIndex: 1000,
});

export default App;
