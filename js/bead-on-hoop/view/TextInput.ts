import Constants from '../../common/BeadOnHoopConstants.js';
import { DOM, Display, Input, VBox, Node, KeyboardUtils } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
export class TextInput extends Node {
  valueSubmittedEmitter: any;
  domElement: HTMLInputElement;
  linkObj: any;
  link: any;
  constructor( options: { inputType: string; initialText: string; onlyLetters: any; width: number; } ) {

    options = _.merge( {

      // can limit contents of the input
      inputType: 'text', // 'text' | 'number'

      onlyLetters: false,

      // number of characters if you want to customize
      width: null,

      // the initial text for the element
      initialText: '',

      linkObj: null

    }, options );

    super( options );

    this.inputType = options.inputType;
    // this.linkObj = options.linkObj;
    // When a new text value is submitted, emit this event to indicate a saved change.
    this.valueSubmittedEmitter = new phet.axon.Emitter();

    // const domElement = document.createElement( 'input' );
    // domElement.type = options.inputType;
    // this.addChild( new phet.scenery.DOM( domElement ) );
    // domElement.value = options.initialText;
    const domElementi = document.createElement("span");
    domElementi.setAttribute("id", "math-span");
    var MQ = globalThis.window.MathQuill.getInterface(2);
    var domElement = MQ.MathField(domElementi, {
      spaceBehavesLikeTab: true, // configurable
      handlers: {
        edit: function() { // useful event handlers
          // latexSpan.textContent = mathField.latex(); // simple API
        }
      }
    });
    domElement.latex('a')
    const spanDOM = new DOM(domElementi);
    this.addChild(spanDOM)
  
    if ( options.onlyLetters ) {
      domElementi.onkeydown = event => {

        return /[a-z]/i.test( event.key );
      }
    }
    domElementi.onkeydown = event => {

      domElement.latex('a')
      return /[a-z]/i.test( event.key );
    }
    // this.linkObj = parseFloat(domElement.value );
    // styling
    // domElement.style.backgroundColor = Constants.buttonFillColor.toCSS();
    // domElement.style.boxShadow = Constants.buttonStrokeColor.toCSS();
    // domElement.style.border = Constants.buttonStrokeColor.toCSS();
    // domElement.style.outlineColor = Constants.interactionColor.toCSS();
    // domElement.style.color = Constants.textFillColor.toCSS();
    // domElement.style.fontSize = Constants.font.size;
    domElementi.style.margin = '0px';
    // domElementi.style.appearance = 'textfield';
    if ( options.width ) {
      // this.linkObj = parseFloat(domElement.value );
      // domElement.size = options.width;
    }

    // A way to get touch areas to work for the DOM element. DOM element bounds
    // through clientWidth/clientHeight are not correct until added to the DOM.
    // Maybe scenery could have a better way to determine the touch areas.
    window.setTimeout( () => {
      this.touchArea = new phet.dot.Bounds2( 0, 0, domElement.clientWidth, domElement.clientHeight );
      this.mouseArea = this.touchArea.copy();
    }, 500 );

    // input listener
    this.addInputListener( {
      down: () => {

        // by focusing the DOM element, we can edit the text directly getting features like
        // edit cursor
        // text addition/deletion
        // text selection
        // copy/paste
        // line wrap, extension beyond background
        // text scrolling
        // all for free!
        // this.linkObj = parseFloat(domElement.value );
        domElement.focus();
        domElement.latex('bbb')
      }
    } );

    // native DOM event listener to handle - while input goes to the DOM element it does NOT go through scenery
    domElementi.addEventListener( 'keyup', event => {
      if ( event.code === KeyboardUtils.KEY_ENTER ) {

        // save the text input for parsing
        this.valueSubmittedEmitter.emit( domElement.value );
        // this.linkObj = parseFloat(domElement.value );
        // remove focus on submit?
        domElement.blur();
      }
    } );
    this.linkObj = parseFloat(domElement.value );
    this.domElement = domElement;
    domElement.latex(domElement.latex() + 'b')
  }

  getElementValue() {
    if ( this.inputType === 'number' ) {

      // string to number - presumably we want to handle that
      this.linkObj = parseFloat( this.domElement.value );
      return parseFloat( this.domElement.value );
    }
    else {
      return this.domElement.value;
    }
  }
}

export default TextInput;