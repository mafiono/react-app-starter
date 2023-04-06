import { objectPropertyOrFallback } from "../../util";
import BaseModel from "./BaseModel";

function parseOrZero(position) {
  let parsedPosition = parseInt(position, 10);

  if (isNaN(parsedPosition)) {
    parsedPosition = 0;
  }

  return parsedPosition;
}

function getDividedContent(content) {
  let summary = null;
  const separatorPosition = content.indexOf("<p>======</p>");

  if (separatorPosition > -1) {
    summary = content.substring(0, separatorPosition);
    content = content.substring(separatorPosition + 13);
  }

  return [summary, content];
}

class ApiContent extends BaseModel {
  constructor(data, options = { sort: null }) {
    super(data);
    let children = [];

    if (Array.isArray(data.subcontent)) {
      for (const child of data.subcontent) {
        children.push(new ApiContent(child));
      }
    }

    const { sort } = options;

    if (sort) {
      children = children.sort(sort);
    }

    this.children = children;

    let [summary, content] = getDividedContent(this.content);

    if (summary !== null) {
      this.summary = summary;
    } else if (this.summary) {
      this.summary = `<p class="__typography__ paragraph">${this.summary}</p>`;
    }

    this.content = content;
  }

  static getPosition(data) {
    const position = objectPropertyOrFallback(data, "position", 0);

    return parseOrZero(position);
  }

  static getParentId(data) {
    const parentId = objectPropertyOrFallback(data, "parent_id", "0");

    if (parentId === "0") {
      return null;
    }

    return parseOrZero(parentId);
  }

  static getId(data) {
    const id = objectPropertyOrFallback(data, "id", "0");

    return parseOrZero(id);
  }

  static getMeta(data) {
    const { head_title, meta_description } = data;

    return {
      title: head_title || undefined,
      description: meta_description || undefined,
    };
  }

  static getImage(data) {
    const { image, image_alt, image_title } = data;

    return {
      src: image || undefined,
      alt: image_alt || undefined,
      title: image_title || undefined,
    };
  }

  static propertyMap = {
    title: null,
    time: null,
    summary: null,
    content: "text",
    slug: "url_title",
    type: null,
    position: ApiContent.getPosition,
    parentId: ApiContent.getParentId,
    id: ApiContent.getId,
    meta: ApiContent.getMeta,
    image: ApiContent.getImage,
  };
}

export default ApiContent;
