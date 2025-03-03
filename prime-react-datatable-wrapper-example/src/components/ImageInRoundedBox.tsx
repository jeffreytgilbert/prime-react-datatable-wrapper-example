import { useState } from "react";
import { resizeToWidth, resolveImagePathFromUUID } from "./Uploadcare";

export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

export interface ImageInRoundedBoxProps {
  uuid: string;
  edits: string;
  alt: string;
  size: number;
  padding?: number;
  corners?: number;
  objectFit?: ObjectFit;
  title?: string;
  onClick?: () => void;
  imgClassName?: string;
  minSizeRatio?: number;
  isZoomedInOnClick?: boolean;
  hoverText?: string;
}

function ImageInRoundedBox({ uuid, edits, alt, size, padding, corners, objectFit, title, onClick, imgClassName, minSizeRatio, isZoomedInOnClick, hoverText }: ImageInRoundedBoxProps) {
  const actualMinSizeRatio = minSizeRatio ? minSizeRatio : .5;
  const actualPadding = size <= 75 ? 0 : (padding ? padding : 15);
  const actualCorners = corners ? corners : 5;
  const actualImageSize = size - (actualPadding * 2);
  const actualObjectFit = objectFit ? objectFit : 'contain';
  const actualMinWidth = size <= 75 ? size : size * actualMinSizeRatio;
  const actualTitle = title?.trim() || '';
  const cursor = onClick ? "pointer" : "default";
  const actualOnClick = isZoomedInOnClick ? () => {
    // do things
    const popupHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zoomed In View</title>
        </head>
        <body style="margin: 0; padding: 0;" onClick="window.close()">
          <div style="display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; background: rgb(0,0,0);">
            <img
              alt="${alt}"
              width="100%"
              height="100%"
              style="width: 100%; border-radius: 3px; aspect-ratio: 1/1; object-fit: scale-down; max-width: 100%; max-height: 100%; vertical-align: middle; margin: 0; padding: 0;"
              src="${resizeToWidth(resolveImagePathFromUUID(uuid, edits), 2880)+'-/quality/best/-/format/jpeg/'}"
            />
          </div>
        </body>
      </html>
    `;

    const windowUrl = URL.createObjectURL(new Blob([popupHtml], { type: 'text/html' }));

    window.open(
      windowUrl,
      '_blank',
      `location=0,toolbar=0,menubar=0,resizable=0,scrollbars=0,status=0,titlebar=0,toolbar=0,width=${screen.availWidth},height=${screen.availHeight}`
    );
  } : onClick;

  const actualPath = resizeToWidth(resolveImagePathFromUUID(uuid+'', edits+''), actualImageSize);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      title={actualTitle}
      style={{
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: actualCorners+"px",
        padding: actualPadding + "px",
        minWidth: actualMinWidth+"px",
        maxWidth: size+"px",
        height: "auto",
        backgroundImage: "url("+actualPath+")",
        backgroundPosition: "top right",
        backgroundSize: "20000%",
        backgroundRepeat: "no-repeat",
        objectFit: actualObjectFit,
        aspectRatio: "1/1",
        overflow: "hidden",
        cursor: cursor,
        position: "relative",
      }}
      onClick={actualOnClick}
      onMouseOver={() => {
        if(isZoomedInOnClick || hoverText){
          setIsHovered(true);
        }
      }}
    >
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            borderRadius: actualCorners+"px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOut={() => {
            setIsHovered(false);
          }}
        >
          <span style={{ color: "white", fontSize: "1.25em" }}>{hoverText ? hoverText : 'Zoom In'}</span>
        </div>
      )}
      <img
        alt={alt}
        width={actualImageSize}
        height={actualImageSize}
        data-uuid={uuid}
        className={imgClassName}
        style={{
          width: '100%',
          borderRadius: 3+'px',
          aspectRatio: '1/1',
          objectFit: 'scale-down',
          maxWidth: actualImageSize + "px",
          maxHeight: actualImageSize + "px",
          verticalAlign: "middle",
          margin: 0,
          padding: 0,
        }}
        src={actualPath}
        data-2k-src={resizeToWidth(resolveImagePathFromUUID(uuid, edits), 2048)+'-/quality/best/-/format/jpeg/'}
        data-hq-src={resizeToWidth(resolveImagePathFromUUID(uuid, edits), 2880)+'-/quality/best/-/format/jpeg/'}
      />
    </div>
  );
}

export default ImageInRoundedBox;