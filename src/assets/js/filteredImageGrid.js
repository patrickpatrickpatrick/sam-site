class FilteredImageGrid extends HTMLElement {
  constructor() {
    super()

    this.root = this.attachShadow({ mode: 'open' })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "data-filter" && oldValue !== newValue) {
      this.fetchAndCreateImages(newValue)
    }
  }

  fetchAndCreateImages(tag) {
    const url = `https://image-tagger-theta.vercel.app/api/images?${tag ? `tags=${tag}` : `featured=true`}`
    
    fetch(url)
      .then(response => response.json())
      .then(json => this.createImages(json.images))
  }

  connectedCallback() {
    this.fetchAndCreateImages()
    this.addEventListener('filterChange', (e) => {
      const tag = e.detail.tag;
      this.fetchAndCreateImages(tag)
    })
  }

  createImages(images) {
    this.shadowRoot.innerHTML = '';

    images.forEach(image => {
      const img = document.createElement('img');
      img.src = `/img/${image.name}`
      this.shadowRoot.append(img)
    })
  }
}

customElements.define("filtered-image-grid", FilteredImageGrid);
