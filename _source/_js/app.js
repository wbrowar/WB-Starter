//  APP
//  🏡 Custom Javascript used for UI and other functionality

import Vue from 'vue';
// import Navigation from './components/Navigation.vue';
// import ScrollUpdater from './components/ScrollUpdater.vue';
import Lazy from './lazy.js';
import { dir, error, log, warn, classToggle, gaTrack } from './global.js';

// VARIABLES
let vueData = {};
let vueMethods = {};
window.VueEvent = new Vue();

// ROOT VARIABLES AND FUNCTIONS
// Alert bar
vueData['alertBarIsVisible'] = false;
vueMethods['toggleAlertBar'] = function () {
    this.alertBarIsVisible = !this.alertBarIsVisible;
};

// Detect resize
vueData['windowWidth'] = false;
vueData['windowHeight'] = false;
vueMethods['resizeHandler'] = function () {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    VueEvent.$emit('window-resized', this.windowWidth, this.windowHeight);
};

// Detect scroll
vueData['scrollY'] = false;
vueMethods['scrollHandler'] = function () {
    window.requestAnimationFrame(() => {
        this.scrollY = window.scrollY;
    });
};

// Display overlay
vueData['visibleOverlays'] = [];
vueMethods['showOverlay'] = function (overlayTitle) {
    VueEvent.$emit('show-overlay', overlayTitle);
    this.visibleOverlays.push(overlayTitle);
    gaTrack('overlay', 'shown', overlayTitle);
};
vueMethods['hideOverlay'] = function (overlayTitle) {
    VueEvent.$emit('hide-overlay', overlayTitle);
    this.visibleOverlays = this.visibleOverlays.filter(item => item !== overlayTitle);
    gaTrack('overlay', 'hidden', overlayTitle);
};

// Generic class toggle utility
// @click="classToggle('selector','class')"
vueMethods['classToggle'] = function (selector, getClass) {
    classToggle(selector, getClass);
};

// Lazy load Vue components
// Vue.component('accordion', function (resolve) {
//     require.ensure(['./components/Accordion.vue', './components/AccordionTab.vue'], function(require){
//         require(['./components/Accordion.vue'], resolve)
//     });
// });
// Vue.component('accordion-tab', function (resolve) {
//     require.ensure(['./components/Accordion.vue', './components/AccordionTab.vue'], function(require){
//         require(['./components/AccordionTab.vue'], resolve)
//     });
// });
// Vue.component('overlay', function (resolve) {
//     require(['./components/Overlay.vue'], resolve)
// });
// Vue.component('slider', function (resolve) {
//     require.ensure(['./components/Slider.vue', './components/SliderControl.vue', './components/SliderSlide.vue'], function(require){
//         require(['./components/Slider.vue'], resolve)
//     });
// });
// Vue.component('slider-control', function (resolve) {
//     require.ensure(['./components/Slider.vue', './components/SliderControl.vue', './components/SliderSlide.vue'], function(require){
//         require(['./components/SliderControl.vue'], resolve)
//     });
// });
// Vue.component('slider-slide', function (resolve) {
//     require.ensure(['./components/Slider.vue', './components/SliderControl.vue', './components/SliderSlide.vue'], function(require){
//         require(['./components/SliderSlide.vue'], resolve)
//     });
// });
// Vue.component('validated-form', function (resolve) {
//     require(['./components/ValidatedForm.vue'], resolve)
// });
// Vue.component('validated-form-input', function (resolve) {
//     require(['./components/ValidatedFormInput.vue'], resolve)
// });

// VUE INSTANCE
new Vue({
    el: '#page',
    data: vueData,
    components: {
        //Navigation,
        //ScrollUpdater,
    },
    created: function () {
        // Watch resize
        window.addEventListener('resize', this.resizeHandler);

        // Watch scroll
        // window.addEventListener('scroll', this.scrollHandler);

        // Manage overlays
        VueEvent.$on('show-overlay', (id) => this.visibleOverlays.push(id));
    },
    methods: vueMethods,
    mounted: function () {
        this.resizeHandler();

        // lazy load images and media
        window.lazy = new Lazy({
            container: '#page',
        });
    },
    delimiters: ['${', '}'],
});

// INIT FUNCTIONS
log('App');