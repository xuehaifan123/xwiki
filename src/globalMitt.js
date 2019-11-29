import mitt from "mitt";

const globalMitt = new mitt();
window.globalMitt = globalMitt;

export default globalMitt;
