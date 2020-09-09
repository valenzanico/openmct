import EventEmitter from 'EventEmitter';

const LOCAL_STORAGE_KEY = 'mct-saved-styles';
const LIMIT = 100;
const PERSIST_ERROR_MESSAGE = 'Problem saving styles';
const LIMIT_WARNING_MESSAGE = 'Saved styles limit reached. Please delete a saved style and try again.';
const DEFAULT_STYLE = {
    backgroundColor: '',
    border: '',
    color: ''
};

/**
 * @typedef {Object} Style
 * @property {*} property
 */
export default class StylesManager extends EventEmitter {
    constructor(openmct) {
        super();

        this.openmct = openmct;
    }

    load() {
        console.log('loading styles');
        const rawStyles = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        const styles = rawStyles ? JSON.parse(rawStyles) : [DEFAULT_STYLE];

        return styles;
    }

    save(style) {
        const styles = this.load();

        if (styles.length < LIMIT) {
            styles.push(style);
            this.persist(styles);
        } else {
            this.openmct.notifications.warning(LIMIT_WARNING_MESSAGE);
        }

        this.emit('stylesUpdated', styles);
    }

    /**
     * @param {Array<Style>} styles saved styles for this browser
     * @private
     */
    persist(styles) {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(styles));
        } catch {
            this.openmct.notifications.error(PERSIST_ERROR_MESSAGE);
        }
    }

    equal(style1, style2) {
        return false;
    }

    select(style) {
        this.emit('styleSelected', style);
    }

    delete(style) {
        const styles = this.load();
        const remainingStyles = styles.filter(keep => !this.equal(keep, style));

        this.persist(remainingStyles);

        this.emit('stylesUpdated', remainingStyles);
    }
}
