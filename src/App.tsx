import React, { useState } from "react";
import "@emotion/styled";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { usePrefersColorScheme } from "@anatoliygatt/use-prefers-color-scheme";
import { useWindowSize } from "rooks";

interface AnnotationProps {
  top?: number | string;
  color: string;
}

interface ThemeProps {
  opacity?: number;
  isDarkMode?: boolean;
}

interface WordProps {
  opacity?: number;
}

enum Icon {
  Email,
  GitHub,
  Website,
}

const IconToLevelMap: Record<Icon, number> = {
  [Icon.Email]: 0,
  [Icon.GitHub]: 1,
  [Icon.Website]: 2,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  const preferredColorScheme = usePrefersColorScheme();
  const [hoverIcon, setHoverIcon] = useState<Icon | undefined>(undefined);
  const { outerWidth } = useWindowSize();

  const isDarkColorSchemePreferred = preferredColorScheme === "dark";

  function getOpacity(icon: Icon): number {
    if (hoverIcon === undefined || icon === hoverIcon) {
      return 1.0;
    }

    return 0.25;
  }

  function getOpacityAt(): number {
    if (
      hoverIcon === undefined ||
      Icon.Email === hoverIcon ||
      Icon.GitHub === hoverIcon
    ) {
      return 1.0;
    }

    return 0.25;
  }

  function getOpacitySam(): number {
    if (hoverIcon === undefined || Icon.Email === hoverIcon) {
      return 1.0;
    }

    return 0.25;
  }

  function getOpacityCedarbaum(): number {
    if (
      hoverIcon === undefined ||
      Icon.Email === hoverIcon ||
      Icon.Website === hoverIcon ||
      Icon.GitHub === hoverIcon
    ) {
      return 1.0;
    }

    return 0.25;
  }

  function getOpacityIo(): number {
    if (
      hoverIcon === undefined ||
      Icon.Website === hoverIcon ||
      Icon.Email === hoverIcon
    ) {
      return 1.0;
    }

    return 0.25;
  }

  function getTop(icon: Icon): number | string {
    const baseTop = outerWidth != null && outerWidth < 768 ? -0.3 : 0;

    if (icon === hoverIcon) {
      return `${baseTop}rem`;
    }

    const level = IconToLevelMap[icon];
    if (hoverIcon !== undefined && level < IconToLevelMap[hoverIcon]) {
      return `${baseTop + 0.9 * (level + 1)}rem`;
    }

    return `${baseTop + 0.9 * level}rem`;
  }

  const fontAndIconColor = isDarkColorSchemePreferred ? "white" : "black";

  return (
    <>
      <Container isDarkMode={isDarkColorSchemePreferred}>
        <AboutCard isDarkMode={isDarkColorSchemePreferred}>
          <PlainText isDarkMode={isDarkColorSchemePreferred}>
            <Word opacity={getOpacitySam()}>sam</Word>
            <Word opacity={getOpacityAt()}>@</Word>
            <Word opacity={getOpacityCedarbaum()}>cedarbaum</Word>
            <Word opacity={getOpacityIo()}>.io</Word>
          </PlainText>
          <AnnotatedSet opacity={getOpacity(Icon.Email)}>
            <Word>
              sam
              <AnnotationBeginning
                color={fontAndIconColor}
                top={getTop(Icon.Email)}
              />
            </Word>
            <Word>
              @<Annotation color={fontAndIconColor} top={getTop(Icon.Email)} />
            </Word>
            <Word>
              cedarbaum
              <Annotation color={fontAndIconColor} top={getTop(Icon.Email)} />
            </Word>
            <Word>
              .io
              <AnnotationEnd
                color={fontAndIconColor}
                top={getTop(Icon.Email)}
              />
            </Word>
          </AnnotatedSet>
          <AnnotatedSet opacity={getOpacity(Icon.GitHub)}>
            <Word>sam</Word>
            <Word>
              @
              <AnnotationBeginning
                color={fontAndIconColor}
                top={getTop(Icon.GitHub)}
              />
            </Word>
            <Word>
              cedarbaum
              <AnnotationEnd
                color={fontAndIconColor}
                top={getTop(Icon.GitHub)}
              />
            </Word>
            <Word>.io</Word>
          </AnnotatedSet>
          <AnnotatedSet opacity={getOpacity(Icon.Website)}>
            <Word>sam</Word>
            <Word>@</Word>
            <Word>
              cedarbaum
              <AnnotationBeginning
                color={fontAndIconColor}
                top={getTop(Icon.Website)}
              />
            </Word>
            <Word>
              .io
              <AnnotationEnd
                color={fontAndIconColor}
                top={getTop(Icon.Website)}
              />
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
                color={fontAndIconColor}
              />
            </a>
            <a
              href={"https://github.com/cedarbaum"}
              target="_blank"
              rel="noreferrer"
              onMouseOver={() => setHoverIcon(Icon.GitHub)}
              onMouseLeave={() => setHoverIcon(undefined)}
            >
              <FontAwesomeIcon
                icon={faGithub}
                size={"2x"}
                color={fontAndIconColor}
              />
            </a>
            <a
              href={"https://cedarbaum.io"}
              target="_blank"
              rel="noreferrer"
              onMouseOver={() => setHoverIcon(Icon.Website)}
              onMouseLeave={() => setHoverIcon(undefined)}
            >
              <FontAwesomeIcon
                icon={faGlobe}
                size={"2x"}
                color={fontAndIconColor}
              />
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
  border: `solid 1px ${props.isDarkMode ? "white" : "black"}`,
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

const Word = styled.div<WordProps>((props) => ({
  display: "inline-block",
  opacity: props.opacity ? props.opacity : 1.0,
  transition: "opacity 0.5s",
  transitionTimingFunction: "ease-in",
}));

const Annotation = styled.div<AnnotationProps>((props) => ({
  visibility: "visible",
  position: "relative",
  backgroundColor: props.color,
  width: 'calc(~"100% + 0.5rem")',
  height: "0.5rem",
  top: props.top,
  left: "-0.25rem",
  transition: "top 0.5s",
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

export default App;
