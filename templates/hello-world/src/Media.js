import { View, layout, raw, Router } from "jops-core";

export default class Media extends View {
  constructor() {
    super();
    this.layout = layout`
      <section id="media" class="media-section">
        <h2 class="section__title">Media</h2>
        <div id="grid" class="media-grid"></div>
      </section>
    `;
    this.inflate();
  }

  async onLayout() {
    for (const item of data) {
      await this.addSubView("grid", new MediaCard(item.imgSrc, item.caption));
    }
  }
}

class MediaCard extends View {
  constructor(imgSrc, caption) {
    super();
    this.imgSrc = imgSrc;
    this.caption = caption;
    this.layout = layout`
        <div class="media-card" type="jops-event-bind" onclick="showMedia">
          <div id="imgSrc" class="media-card__img-placeholder"></div>
          <p id="caption" class="media-card__caption"></p>
        </div>
    `;
    this.inflate();
  }

  onLayout() {
    this.get("imgSrc").set(
      `<img src="${this.imgSrc}" style="width:100%;border-radius:6px">`,
    );
    this.get("caption").set(this.caption);
  }

  showMedia(event) {
    Router.singleton().navigate(
      `/mediadialog?imgSrc=${encodeURIComponent(this.imgSrc)}&caption=${encodeURIComponent(this.caption)}`,
      MediaDialog,
    );
  }
}

class MediaDialog extends View {
  constructor() {
    super();
    this.layout = layout`
      <div class="media-dialog">
        <button class="media-dialog__back btn btn--secondary" type="jops-event-bind" onclick="onBack">← Back</button>
        <div id="dialogImage" class="media-dialog__image"></div>
        <p id="dialogCaption" class="media-dialog__caption"></p>
      </div>
    `;
    this.inflate();
  }

  onLayout() {
    setTimeout(() => {
      const { imgSrc, caption } = Router.singleton().getParams();
      if (!imgSrc) return;
      this.get("dialogImage").set(
        `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:contain">`,
      );
      this.get("dialogCaption").set(caption ?? "");
    }, 0);
  }

  onBack() {
    Router.singleton().back();
  }
}

const data = [
  {
    imgSrc: "/assets/jops-hierarchy.svg",
    caption: "View Hierarchy — composable tree of Views",
  },
  {
    imgSrc: "/assets/jops-lifecycle.svg",
    caption: "View Lifecycle — loadLayout → inflate → onLayout → onResume",
  },
  {
    imgSrc: "/assets/jops-navigation.svg",
    caption: "Navigation Model — flat tabs + hierarchical stack",
  },
];
