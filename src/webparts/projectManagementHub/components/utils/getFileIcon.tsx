export const getFileIcon = (docType: string): string => {
  const iconName = [
    "accdb",
    "csv",
    "docx",
    "dotx",
    "mpp",
    "mpt",
    "model",
    "one",
    "onetoc",
    "potx",
    "ppsx",
    "pdf",
    "photo",
    "pptx",
    "presentation",
    "potx",
    "pub",
    "rtf",
    "spreadsheet",
    "txt",
    "vector",
    "vsdx",
    "vssx",
    "vstx",
    "xlsx",
    "xltx",
    "xsn",
    "archive",
    "docset",
    "exe",
    "folder",
    "font",
    "html",
    "link",
    "listitem",
    "onepkg",
    "sharedfolder",
    "spo",
    "sysfile",
    "xls",
    "xml",
    "zip",
  ];

  if (
    docType === "adoc.bedoc" ||
    docType === "asice" ||
    docType === "adoc" ||
    docType === "bdoc" ||
    docType === "edoc"
  )
    return `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/txt.svg`;
  if (docType === "jpeg" || docType === "png" || docType === "jpg")
    return `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/photo.svg`;
  if (docType === "eml" || docType === "msg" || docType === "mbox")
    return "https://static2.sharepointonline.com/files/fabric/assets/item-types/16/email.svg";
  if (docType === "mp4" || docType === "mpeg" || docType === "webm")
    return "https://static2.sharepointonline.com/files/fabric/assets/item-types/16/video.svg";
  if (docType === "mp3")
    return "https://static2.sharepointonline.com/files/fabric/assets/item-types/16/audio.svg";
  if (docType === "json" || docType === "css" || docType === "js")
    return "https://static2.sharepointonline.com/files/fabric/assets/item-types/16/code.svg";
  if (docType === "url")
    return "https://static2.sharepointonline.com/files/fabric/assets/item-types/16/link.svg";
  if (iconName.indexOf(docType) > -1)
    return `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${docType}.svg`;

  return `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/genericfile.svg`;
};
