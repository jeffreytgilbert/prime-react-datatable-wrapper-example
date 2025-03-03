
function resolveImagePathFromUUID(uuid: string, edits?: string) {
  return 'https://ucarecdn.com/'+uuid+(edits?'/'+edits:'')+'/';
}

function resizeToWidth(path: string, width: number) {
  return path+'-/preview/'+width+'x'+width+'/';
}

export interface ImagePathProps {
  uuid?: string;
  edits?: string;
  src?: string;
  size: number;
  padding?: number;
}

function uploadcareImagePath({ uuid, edits, src, size, padding }: ImagePathProps) {
  const actualPadding = size <= 75 ? 0 : (padding ? padding : 15);
  const actualImageSize = size - (actualPadding * 2);
  let actualPath = '';
  if(src){
    actualPath = src;
  }
  else {
    actualPath = resizeToWidth(resolveImagePathFromUUID(uuid+'', edits+''), actualImageSize);
  }
  return actualPath;
}

export {
  uploadcareImagePath,
  resizeToWidth,
  resolveImagePathFromUUID
}