class FilteredImageGrid extends HTMLElement {
  constructor() {
    super()

    this.root = this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
      <div class="filter-image-grid"></div>
      <link rel="stylesheet" href="/css/filteredImageGrid.css" />
    `

    this.gridDiv = this.shadowRoot.querySelector('.filter-image-grid');
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
    this.gridDiv.innerHTML = ``;

    images.forEach(image => {
      const img = document.createElement('img');
      img.src = `/img/${image.name}`
      img.alt = image.alt

      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        img.style = `aspect-ratio: ${ratio};`
      }

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('filter-image-grid__image-container')
      imgDiv.append(img);

      this.gridDiv.append(imgDiv)
    })
  }
}

customElements.define("filtered-image-grid", FilteredImageGrid);
