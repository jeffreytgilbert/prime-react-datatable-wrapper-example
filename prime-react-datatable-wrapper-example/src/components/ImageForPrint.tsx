import { resizeToWidth, resolveImagePathFromUUID } from "./Uploadcare";

export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

export interface ImageInRoundedBoxProps {
  uuid?: string;
  edits?: string;
  src?: string;
  alt: string;
  size: number;
  padding?: number;
  corners?: number;
  title?: string;
  borderColor?: string;
}

function ImageForPrint({ uuid, edits, src, alt, size, padding, corners, title, borderColor }: ImageInRoundedBoxProps) {
  const actualPadding = size <= 75 ? 0 : (padding ? padding : 15);
  const actualCorners = corners ? corners : 5;
  const actualImageSize = size - (actualPadding * 2);
  // const actualObjectFit = objectFit ? objectFit : 'none';
  // const actualMinWidth = size <= 75 ? size : size/2;
  const actualTitle = title?.trim() || '';
  const actualBorderColor = borderColor || '#ddd';
  let actualPath = '';
  if(src){
    actualPath = src;
  }
  else {
    actualPath = resizeToWidth(resolveImagePathFromUUID(uuid+'', edits+''), 2*actualImageSize);
  }
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
        // minWidth: actualMinWidth+"px",
        maxHeight: size+"px",
        maxWidth: size+"px",
        width: size+"px",
        height: size+"px",
        border: "1px solid "+actualBorderColor,
        // backgroundImage: "url("+actualPath+")",
        // backgroundPosition: "top right",
        // backgroundSize: "20000%",
        // backgroundRepeat: "no-repeat",
        // objectFit: actualObjectFit,
        aspectRatio: "1/1",
        overflow: "hidden",
      }}
    >
      <img
        alt={alt}
        width={actualImageSize}
        height={actualImageSize}
        style={{
          width: '100%',
          borderRadius: 3+'px',
          aspectRatio: '1/1',
          objectFit: 'scale-down',
          maxWidth: actualImageSize + "px",
          maxHeight: actualImageSize + "px",
          // lineHeight: actualImageSize + "px",
          verticalAlign: "middle",
          margin: 0,
          padding: 0,
        }}
        src={actualPath}
      />
    </div>
  );
}

export default ImageForPrint;