import { Component } from '../base/Component';

interface IGalleryView {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalleryView> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}