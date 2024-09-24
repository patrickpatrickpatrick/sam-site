class TagFilter extends HTMLElement {
  selectedFilter;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    const tags = JSON.parse(this.getAttribute('tags'));
    const target = this.getAttribute('target');

    if (tags) {
      tags.forEach((tag) => {
        const button = document.createElement('button');
        button.innerHTML = `${tag.tag} (${tag.count})`
        button.setAttribute('name', tag.tag)
        this.root.append(button)
      })
    } else {
      throw Error('No tags provided!')
    }

    this.root.addEventListener('click', (e) => {
      const tag = e.target.getAttribute('name');

      document.querySelector(`#${target}`).dispatchEvent(new CustomEvent(
        'filterChange',
        {
          detail: {
            tag
          }
        }
      ))
    })
  }
}

customElements.define("tag-filter", TagFilter);
