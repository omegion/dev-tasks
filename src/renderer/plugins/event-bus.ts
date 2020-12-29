import mitt from "mitt";

const emitter = mitt();

export default function(ctx, inject) {
  inject("emitter", emitter);
}
