function e(e,t,n,r){let i=Math.max(1,Math.min(e,t)),a=Math.min(Math.min(n,20)+r,i),o=Math.min(a,Math.floor(e/2)),s=Math.min(a,Math.floor(t/2)),c=t=>t/e*2-1,l=e=>e/t*2-1,u=e,d=t,f=o,p=e-o,m=s,h=t-s,g=c(0),_=c(u),v=l(0),y=l(d),b=c(f),x=c(p),S=l(m),C=l(h),w=o/e,T=1-o/e,E=s/t,D=1-s/t;return{positions:new Float32Array([g,v,_,v,g,S,g,S,_,v,_,S,g,C,_,C,g,y,g,y,_,C,_,y,g,S,b,S,g,C,g,C,b,S,b,C,x,S,_,S,x,C,x,C,_,S,_,C]),uvs:new Float32Array([0,0,1,0,0,E,0,E,1,0,1,E,0,D,1,D,0,1,0,1,1,D,1,1,0,E,w,E,0,D,0,D,w,E,w,D,T,E,1,E,T,D,T,D,1,E,1,D])}}function t(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Failed to create shader`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)||`Unknown shader error`;throw e.deleteShader(r),Error(t)}return r}function n(e,n,r){let i=t(e,e.VERTEX_SHADER,n),a=t(e,e.FRAGMENT_SHADER,r),o=e.createProgram();if(!o)throw Error(`Failed to create program`);if(e.attachShader(o,i),e.attachShader(o,a),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)){let t=e.getProgramInfoLog(o)||`Unknown link error`;throw e.deleteProgram(o),e.deleteShader(i),e.deleteShader(a),Error(t)}return e.deleteShader(i),e.deleteShader(a),o}var r=[`rgb(57, 182, 255)`,`rgb(189, 69, 251)`,`rgb(255, 87, 51)`,`rgb(255, 214, 0)`];function i(e){let t=e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);if(!t)throw Error(`Invalid color format: ${e}`);let[,n,r,i]=t;return[parseInt(n)/255,parseInt(r)/255,parseInt(i)/255]}var a=class{element;canvas;options;running=!1;disposed=!1;startTime=0;lastTime=0;rafId=null;glr;observer;constructor(e={}){this.options={width:e.width??600,height:e.height??600,ratio:e.ratio??window.devicePixelRatio??1,borderWidth:e.borderWidth??8,glowWidth:e.glowWidth??200,borderRadius:e.borderRadius??8,mode:e.mode??`light`,...e},this.canvas=document.createElement(`canvas`),this.options.classNames&&(this.canvas.className=this.options.classNames),this.options.styles&&Object.assign(this.canvas.style,this.options.styles),this.canvas.style.display=`block`,this.canvas.style.transformOrigin=`center`,this.canvas.style.pointerEvents=`none`,this.element=this.canvas,this.setupGL(),this.options.skipGreeting||this.greet()}start(){if(this.disposed)throw Error(`Motion instance has been disposed.`);if(this.running)return;if(!this.glr){console.error(`WebGL resources are not initialized.`);return}this.running=!0,this.startTime=performance.now(),this.resize(this.options.width??600,this.options.height??600,this.options.ratio),this.glr.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.glr.gl.useProgram(this.glr.program),this.glr.gl.uniform2f(this.glr.uResolution,this.canvas.width,this.canvas.height),this.checkGLError(this.glr.gl,`start: after initial setup`);let e=()=>{if(!this.running||!this.glr)return;this.rafId=requestAnimationFrame(e);let t=performance.now();if(t-this.lastTime<1e3/32)return;this.lastTime=t;let n=(t-this.startTime)*.001;this.render(n)};this.rafId=requestAnimationFrame(e)}pause(){if(this.disposed)throw Error(`Motion instance has been disposed.`);this.running=!1,this.rafId!==null&&cancelAnimationFrame(this.rafId)}dispose(){if(this.disposed)return;this.disposed=!0,this.running=!1,this.rafId!==null&&cancelAnimationFrame(this.rafId);let{gl:e,vao:t,positionBuffer:n,uvBuffer:r,program:i}=this.glr;t&&e.deleteVertexArray(t),n&&e.deleteBuffer(n),r&&e.deleteBuffer(r),e.deleteProgram(i),this.observer&&this.observer.disconnect(),this.canvas.remove()}resize(t,n,r){if(this.disposed)throw Error(`Motion instance has been disposed.`);if(this.options.width=t,this.options.height=n,r&&(this.options.ratio=r),!this.running)return;let{gl:i,program:a,vao:o,positionBuffer:s,uvBuffer:c,uResolution:l}=this.glr,u=r??this.options.ratio??window.devicePixelRatio??1,d=Math.max(1,Math.floor(t*u)),f=Math.max(1,Math.floor(n*u));this.canvas.style.width=`${t}px`,this.canvas.style.height=`${n}px`,(this.canvas.width!==d||this.canvas.height!==f)&&(this.canvas.width=d,this.canvas.height=f),i.viewport(0,0,this.canvas.width,this.canvas.height),this.checkGLError(i,`resize: after viewport setup`);let{positions:p,uvs:m}=e(this.canvas.width,this.canvas.height,this.options.borderWidth*u,this.options.glowWidth*u);i.bindVertexArray(o),i.bindBuffer(i.ARRAY_BUFFER,s),i.bufferData(i.ARRAY_BUFFER,p,i.STATIC_DRAW);let h=i.getAttribLocation(a,`aPosition`);i.enableVertexAttribArray(h),i.vertexAttribPointer(h,2,i.FLOAT,!1,0,0),this.checkGLError(i,`resize: after position buffer update`),i.bindBuffer(i.ARRAY_BUFFER,c),i.bufferData(i.ARRAY_BUFFER,m,i.STATIC_DRAW);let g=i.getAttribLocation(a,`aUV`);i.enableVertexAttribArray(g),i.vertexAttribPointer(g,2,i.FLOAT,!1,0,0),this.checkGLError(i,`resize: after UV buffer update`),i.useProgram(a),i.uniform2f(l,this.canvas.width,this.canvas.height),i.uniform1f(this.glr.uBorderWidth,this.options.borderWidth*u),i.uniform1f(this.glr.uGlowWidth,this.options.glowWidth*u),i.uniform1f(this.glr.uBorderRadius,this.options.borderRadius*u),this.checkGLError(i,`resize: after uniform updates`);let _=performance.now();this.lastTime=_;let v=(_-this.startTime)*.001;this.render(v)}autoResize(e){this.observer&&this.observer.disconnect(),this.observer=new ResizeObserver(()=>{let t=e.getBoundingClientRect();this.resize(t.width,t.height)}),this.observer.observe(e)}fadeIn(){if(this.disposed)throw Error(`Motion instance has been disposed.`);return new Promise((e,t)=>{let n=this.canvas.animate([{opacity:0,transform:`scale(1.2)`},{opacity:1,transform:`scale(1)`}],{duration:300,easing:`ease-out`,fill:`forwards`});n.onfinish=()=>e(),n.oncancel=()=>t(`canceled`)})}fadeOut(){if(this.disposed)throw Error(`Motion instance has been disposed.`);return new Promise((e,t)=>{let n=this.canvas.animate([{opacity:1,transform:`scale(1)`},{opacity:0,transform:`scale(1.2)`}],{duration:300,easing:`ease-in`,fill:`forwards`});n.onfinish=()=>e(),n.oncancel=()=>t(`canceled`)})}checkGLError(e,t){let n=e.getError();if(n!==e.NO_ERROR){for(console.group(`🔴 WebGL Error in ${t}`);n!==e.NO_ERROR;){let t=this.getGLErrorName(e,n);console.error(`${t} (0x${n.toString(16)})`),n=e.getError()}console.groupEnd()}}getGLErrorName(e,t){switch(t){case e.INVALID_ENUM:return`INVALID_ENUM`;case e.INVALID_VALUE:return`INVALID_VALUE`;case e.INVALID_OPERATION:return`INVALID_OPERATION`;case e.INVALID_FRAMEBUFFER_OPERATION:return`INVALID_FRAMEBUFFER_OPERATION`;case e.OUT_OF_MEMORY:return`OUT_OF_MEMORY`;case e.CONTEXT_LOST_WEBGL:return`CONTEXT_LOST_WEBGL`;default:return`UNKNOWN_ERROR`}}setupGL(){let t=this.canvas.getContext(`webgl2`,{antialias:!1,alpha:!0});if(!t)throw Error(`WebGL2 is required but not available.`);let a=n(t,`#version 300 es
in vec2 aPosition;
in vec2 aUV;
out vec2 vUV;
void main() {
vUV = aUV;
gl_Position = vec4(aPosition, 0.0, 1.0);
}`,`#version 300 es
precision lowp float;
in vec2 vUV;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBorderWidth;
uniform float uGlowWidth;
uniform float uBorderRadius;
uniform vec3 uColors[4];
uniform float uGlowExponent;
uniform float uGlowFactor;
const float PI = 3.14159265359;
const float TWO_PI = 2.0 * PI;
const float HALF_PI = 0.5 * PI;
const vec4 startPositions = vec4(0.0, PI, HALF_PI, 1.5 * PI);
const vec4 speeds = vec4(-1.9, -1.9, -1.5, 2.1);
const vec4 innerRadius = vec4(PI * 0.8, PI * 0.7, PI * 0.3, PI * 0.1);
const vec4 outerRadius = vec4(PI * 1.2, PI * 0.9, PI * 0.6, PI * 0.4);
float random(vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
vec2 random2(vec2 st) {
return vec2(random(st), random(st + 1.0));
}
float aaStep(float edge, float d) {
float width = fwidth(d);
return smoothstep(edge - width * 0.5, edge + width * 0.5, d);
}
float aaFract(float x) {
float f = fract(x);
float w = fwidth(x);
float smooth_f = f * (1.0 - smoothstep(1.0 - w, 1.0, f));
return smooth_f;
}
float sdRoundedBox(in vec2 p, in vec2 b, in float r) {
vec2 q = abs(p) - b + r;
return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}
float getInnerGlow(vec2 p, vec2 b, float radius) {
float dist_x = b.x - abs(p.x);
float dist_y = b.y - abs(p.y);
float glow_x = smoothstep(radius, 0.0, dist_x);
float glow_y = smoothstep(radius, 0.0, dist_y);
return 1.0 - (1.0 - glow_x) * (1.0 - glow_y);
}
float getVignette(vec2 uv) {
vec2 vignetteUv = uv;
vignetteUv = vignetteUv * (1.0 - vignetteUv);
float vignette = vignetteUv.x * vignetteUv.y * 25.0;
vignette = pow(vignette, 0.16);
vignette = 1.0 - vignette;
return vignette;
}
float uvToAngle(vec2 uv) {
vec2 center = vec2(0.5);
vec2 dir = uv - center;
return atan(dir.y, dir.x) + PI;
}
void main() {
vec2 uv = vUV;
vec2 pos = uv * uResolution;
vec2 centeredPos = pos - uResolution * 0.5;
vec2 size = uResolution - uBorderWidth;
vec2 halfSize = size * 0.5;
float dBorderBox = sdRoundedBox(centeredPos, halfSize, uBorderRadius);
float border = aaStep(0.0, dBorderBox);
float glow = getInnerGlow(centeredPos, halfSize, uGlowWidth);
float vignette = getVignette(uv);
glow *= vignette;
float posAngle = uvToAngle(uv);
vec4 lightCenter = mod(startPositions + speeds * uTime, TWO_PI);
vec4 angleDist = abs(posAngle - lightCenter);
vec4 disToLight = min(angleDist, TWO_PI - angleDist) / TWO_PI;
float intensityBorder[4];
intensityBorder[0] = 1.0;
intensityBorder[1] = smoothstep(0.4, 0.0, disToLight.y);
intensityBorder[2] = smoothstep(0.4, 0.0, disToLight.z);
intensityBorder[3] = smoothstep(0.2, 0.0, disToLight.w) * 0.5;
vec3 borderColor = vec3(0.0);
for(int i = 0; i < 4; i++) {
borderColor = mix(borderColor, uColors[i], intensityBorder[i]);
}
borderColor *= 1.1;
borderColor = clamp(borderColor, 0.0, 1.0);
float intensityGlow[4];
intensityGlow[0] = smoothstep(0.9, 0.0, disToLight.x);
intensityGlow[1] = smoothstep(0.7, 0.0, disToLight.y);
intensityGlow[2] = smoothstep(0.4, 0.0, disToLight.z);
intensityGlow[3] = smoothstep(0.1, 0.0, disToLight.w) * 0.7;
vec4 breath = smoothstep(0.0, 1.0, sin(uTime * 1.0 + startPositions * PI) * 0.2 + 0.8);
vec3 glowColor = vec3(0.0);
glowColor += uColors[0] * intensityGlow[0] * breath.x;
glowColor += uColors[1] * intensityGlow[1] * breath.y;
glowColor += uColors[2] * intensityGlow[2] * breath.z;
glowColor += uColors[3] * intensityGlow[3] * breath.w * glow;
glow = pow(glow, uGlowExponent);
glow *= random(pos + uTime) * 0.1 + 1.0;
glowColor *= glow * uGlowFactor;
glowColor = clamp(glowColor, 0.0, 1.0);
vec3 color = mix(glowColor, borderColor + glowColor * 0.2, border);
float alpha = mix(glow, 1.0, border);
outColor = vec4(color, alpha);
}`);this.checkGLError(t,`setupGL: after createProgram`);let o=t.createVertexArray();t.bindVertexArray(o),this.checkGLError(t,`setupGL: after VAO creation`);let{positions:s,uvs:c}=e(this.canvas.width||2,this.canvas.height||2,this.options.borderWidth,this.options.glowWidth),l=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,s,t.STATIC_DRAW);let u=t.getAttribLocation(a,`aPosition`);t.enableVertexAttribArray(u),t.vertexAttribPointer(u,2,t.FLOAT,!1,0,0),this.checkGLError(t,`setupGL: after position buffer setup`);let d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,c,t.STATIC_DRAW);let f=t.getAttribLocation(a,`aUV`);t.enableVertexAttribArray(f),t.vertexAttribPointer(f,2,t.FLOAT,!1,0,0),this.checkGLError(t,`setupGL: after UV buffer setup`);let p=t.getUniformLocation(a,`uResolution`),m=t.getUniformLocation(a,`uTime`),h=t.getUniformLocation(a,`uBorderWidth`),g=t.getUniformLocation(a,`uGlowWidth`),_=t.getUniformLocation(a,`uBorderRadius`),v=t.getUniformLocation(a,`uColors`),y=t.getUniformLocation(a,`uGlowExponent`),b=t.getUniformLocation(a,`uGlowFactor`);t.useProgram(a),t.uniform1f(h,this.options.borderWidth),t.uniform1f(g,this.options.glowWidth),t.uniform1f(_,this.options.borderRadius),this.options.mode===`dark`?(t.uniform1f(y,2),t.uniform1f(b,1.8)):(t.uniform1f(y,1),t.uniform1f(b,1));let x=(this.options.colors||r).map(i);for(let e=0;e<x.length;e++)t.uniform3f(t.getUniformLocation(a,`uColors[${e}]`),...x[e]);this.checkGLError(t,`setupGL: after uniform setup`),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null),this.glr={gl:t,program:a,vao:o,positionBuffer:l,uvBuffer:d,uResolution:p,uTime:m,uBorderWidth:h,uGlowWidth:g,uBorderRadius:_,uColors:v}}render(e){if(!this.glr)return;let{gl:t,program:n,vao:r,uTime:i}=this.glr;t.useProgram(n),t.bindVertexArray(r),t.uniform1f(i,e),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.disable(t.BLEND),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLES,0,24),this.checkGLError(t,`render: after draw call`),t.bindVertexArray(null)}greet(){console.log(`%c🌈 ai-motion 0.4.8 🌈`,`background: linear-gradient(90deg, #39b6ff, #bd45fb, #ff5733, #ffd600); color: white; text-shadow: 0 0 2px rgba(0, 0, 0, 0.2); font-weight: bold; font-size: 1em; padding: 2px 12px; border-radius: 6px;`)}};(function(){try{if(typeof document<`u`){var e=document.createElement(`style`);e.appendChild(document.createTextNode(`._wrapper_1ooyb_1 {
	position: fixed;
	inset: 0;
	z-index: 2147483641; /* 确保在所有元素之上，除了 panel */
	cursor: wait;
	overflow: hidden;

	display: none;
}

._wrapper_1ooyb_1._visible_1ooyb_11 {
	display: block;
}
/* AI 光标样式 */
._cursor_1dgwb_2 {
	position: absolute;
	width: var(--cursor-size, 75px);
	height: var(--cursor-size, 75px);
	pointer-events: none;
	z-index: 10000;
}

._cursorBorder_1dgwb_10 {
	position: absolute;
	width: 100%;
	height: 100%;
	background: linear-gradient(45deg, rgb(57, 182, 255), rgb(189, 69, 251));
	mask-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%20fill='none'%3e%3cg%3e%3cpath%20d='M%2015%2042%20L%2015%2036.99%20Q%2015%2031.99%2023.7%2031.99%20L%2028.05%2031.99%20Q%2032.41%2031.99%2032.41%2021.99%20L%2032.41%2017%20Q%2032.41%2012%2041.09%2016.95%20L%2076.31%2037.05%20Q%2085%2042%2076.31%2046.95%20L%2041.09%2067.05%20Q%2032.41%2072%2032.41%2062.01%20L%2032.41%2057.01%20Q%2032.41%2052.01%2023.7%2052.01%20L%2019.35%2052.01%20Q%2015%2052.01%2015%2047.01%20Z'%20fill='none'%20stroke='%23000000'%20stroke-width='6'%20stroke-miterlimit='10'%20style='stroke:%20light-dark(rgb(0,%200,%200),%20rgb(255,%20255,%20255));'/%3e%3c/g%3e%3c/svg%3e");
	mask-size: 100% 100%;
	mask-repeat: no-repeat;

	transform-origin: center;
	transform: rotate(-135deg) scale(1.2);
	margin-left: -10px;
	margin-top: -18px;
}

._cursorFilling_1dgwb_25 {
	position: absolute;
	width: 100%;
	height: 100%;
	background: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3e%3cdefs%3e%3c/defs%3e%3cg%20xmlns='http://www.w3.org/2000/svg'%20style='filter:%20drop-shadow(light-dark(rgba(0,%200,%200,%200.4),%20rgba(237,%20237,%20237,%200.4))%203px%204px%204px);'%3e%3cpath%20d='M%2015%2042%20L%2015%2036.99%20Q%2015%2031.99%2023.7%2031.99%20L%2028.05%2031.99%20Q%2032.41%2031.99%2032.41%2021.99%20L%2032.41%2017%20Q%2032.41%2012%2041.09%2016.95%20L%2076.31%2037.05%20Q%2085%2042%2076.31%2046.95%20L%2041.09%2067.05%20Q%2032.41%2072%2032.41%2062.01%20L%2032.41%2057.01%20Q%2032.41%2052.01%2023.7%2052.01%20L%2019.35%2052.01%20Q%2015%2052.01%2015%2047.01%20Z'%20fill='%23ffffff'%20stroke='none'%20style='fill:%20%23ffffff;'/%3e%3c/g%3e%3c/svg%3e");
	background-size: 100% 100%;
	background-repeat: no-repeat;

	transform-origin: center;
	transform: rotate(-135deg) scale(1.2);
	margin-left: -10px;
	margin-top: -18px;
}

._cursorRipple_1dgwb_39 {
	position: absolute;
	width: 100%;
	height: 100%;
	pointer-events: none;
	margin-left: -50%;
	margin-top: -50%;

	&::after {
		content: '';
		opacity: 0;
		position: absolute;
		inset: 0;
		border: 4px solid rgba(57, 182, 255, 1);
		border-radius: 50%;
	}
}

._cursor_1dgwb_2._clicking_1dgwb_57 ._cursorRipple_1dgwb_39::after {
	animation: _cursor-ripple_1dgwb_1 300ms ease-out forwards;
}

@keyframes _cursor-ripple_1dgwb_1 {
	0% {
		transform: scale(0);
		opacity: 1;
	}
	100% {
		transform: scale(2);
		opacity: 0;
	}
}`)),document.head.appendChild(e)}}catch(e){console.error(`vite-plugin-css-injected-by-js`,e)}})();function o(){try{return!!(s()||c()||l()||u()||f()||d())}catch(e){return console.warn(`Error determining if page is dark:`,e),!1}}function s(){let e=[`dark`,`dark-mode`,`theme-dark`,`night`,`night-mode`],t=document.documentElement,n=document.body||document.documentElement;for(let r of e)if(t.classList.contains(r)||n?.classList.contains(r))return!0;return!1}function c(){let e=document.documentElement,t=document.body||document.documentElement;for(let n of[`data-theme`,`data-color-mode`,`data-bs-theme`,`data-mui-color-scheme`]){let r=t?.getAttribute(n),i=e.getAttribute(n);if(r?.toLowerCase()===`dark`||i?.toLowerCase()===`dark`)return!0}return!1}function l(){let e=document.querySelector(`meta[name="color-scheme"]`)?.content.toLowerCase();if(e===`dark`||e===`only dark`)return!0;let t=window.getComputedStyle(document.documentElement).getPropertyValue(`color-scheme`).trim().toLowerCase();return t===`dark`||t===`only dark`}function u(){let e=window.getComputedStyle(document.documentElement),t=window.getComputedStyle(document.body||document.documentElement),n=e.backgroundColor,r=t.backgroundColor;return h(r)?!0:r===`transparent`||r.startsWith(`rgba(0, 0, 0, 0)`)?h(n):!1}function d(){let e=m(window.getComputedStyle(document.body||document.documentElement).color);return e!==null&&e>200}function f(){let{innerWidth:e,innerHeight:t}=window,n=e*t*.5;for(let e of[`#app`,`#root`,`#__next`]){let t=document.querySelector(e);if(!t)continue;let r=t.getBoundingClientRect();if(!(r.width*r.height<n)&&h(window.getComputedStyle(t).backgroundColor))return!0}return!1}function p(e){let t=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(e);return t?{r:parseInt(t[1]),g:parseInt(t[2]),b:parseInt(t[3])}:null}function m(e){if(!e||e===`transparent`||e.startsWith(`rgba(0, 0, 0, 0)`))return null;let t=p(e);return t?.299*t.r+.587*t.g+.114*t.b:null}function h(e,t=128){let n=m(e);return n!==null&&n<t}var g={wrapper:`_wrapper_1ooyb_1`,visible:`_visible_1ooyb_11`},_={cursor:`_cursor_1dgwb_2`,cursorBorder:`_cursorBorder_1dgwb_10`,cursorFilling:`_cursorFilling_1dgwb_25`,cursorRipple:`_cursorRipple_1dgwb_39`,clicking:`_clicking_1dgwb_57`,"cursor-ripple":`_cursor-ripple_1dgwb_1`},v=class extends EventTarget{shown=!1;wrapper=document.createElement(`div`);motion=null;#e=!1;#t=document.createElement(`div`);#n=0;#r=0;#i=0;#a=0;constructor(){super(),this.wrapper.id=`page-agent-runtime_simulator-mask`,this.wrapper.className=g.wrapper,this.wrapper.setAttribute(`data-browser-use-ignore`,`true`),this.wrapper.setAttribute(`data-page-agent-ignore`,`true`);try{let e=new a({mode:o()?`dark`:`light`,styles:{position:`absolute`,inset:`0`}});this.motion=e,this.wrapper.appendChild(e.element),e.autoResize(this.wrapper)}catch(e){console.warn(`[SimulatorMask] Motion overlay unavailable:`,e)}this.wrapper.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault()}),this.wrapper.addEventListener(`mousedown`,e=>{e.stopPropagation(),e.preventDefault()}),this.wrapper.addEventListener(`mouseup`,e=>{e.stopPropagation(),e.preventDefault()}),this.wrapper.addEventListener(`mousemove`,e=>{e.stopPropagation(),e.preventDefault()}),this.wrapper.addEventListener(`wheel`,e=>{e.stopPropagation(),e.preventDefault()}),this.wrapper.addEventListener(`keydown`,e=>{e.stopPropagation(),e.preventDefault()}),this.wrapper.addEventListener(`keyup`,e=>{e.stopPropagation(),e.preventDefault()}),this.#o(),document.body.appendChild(this.wrapper),this.#s();let e=e=>{let{x:t,y:n}=e.detail;this.setCursorPosition(t,n)},t=()=>{this.triggerClickAnimation()},n=()=>{this.wrapper.style.pointerEvents=`none`},r=()=>{this.wrapper.style.pointerEvents=`auto`};window.addEventListener(`PageAgent::MovePointerTo`,e),window.addEventListener(`PageAgent::ClickPointer`,t),window.addEventListener(`PageAgent::EnablePassThrough`,n),window.addEventListener(`PageAgent::DisablePassThrough`,r),this.addEventListener(`dispose`,()=>{window.removeEventListener(`PageAgent::MovePointerTo`,e),window.removeEventListener(`PageAgent::ClickPointer`,t),window.removeEventListener(`PageAgent::EnablePassThrough`,n),window.removeEventListener(`PageAgent::DisablePassThrough`,r)})}#o(){this.#t.className=_.cursor;let e=document.createElement(`div`);e.className=_.cursorRipple,this.#t.appendChild(e);let t=document.createElement(`div`);t.className=_.cursorFilling,this.#t.appendChild(t);let n=document.createElement(`div`);n.className=_.cursorBorder,this.#t.appendChild(n),this.wrapper.appendChild(this.#t)}#s(){if(this.#e)return;let e=this.#n+(this.#i-this.#n)*.2,t=this.#r+(this.#a-this.#r)*.2,n=Math.abs(e-this.#i);n>0&&(this.#n=n<2?this.#i:e,this.#t.style.left=`${this.#n}px`);let r=Math.abs(t-this.#a);r>0&&(this.#r=r<2?this.#a:t,this.#t.style.top=`${this.#r}px`),requestAnimationFrame(()=>this.#s())}setCursorPosition(e,t){this.#e||(this.#i=e,this.#a=t)}triggerClickAnimation(){this.#e||(this.#t.classList.remove(_.clicking),this.#t.getBoundingClientRect(),this.#t.classList.add(_.clicking))}show(){this.shown||this.#e||(this.shown=!0,this.motion?.start(),this.motion?.fadeIn(),this.wrapper.classList.add(g.visible),this.#n=window.innerWidth/2,this.#r=window.innerHeight/2,this.#i=this.#n,this.#a=this.#r,this.#t.style.left=`${this.#n}px`,this.#t.style.top=`${this.#r}px`)}hide(){!this.shown||this.#e||(this.shown=!1,this.motion?.fadeOut(),this.motion?.pause(),this.#t.classList.remove(_.clicking),setTimeout(()=>{this.wrapper.classList.remove(g.visible)},800))}dispose(){this.#e=!0,this.motion?.dispose(),this.wrapper.remove(),this.dispatchEvent(new Event(`dispose`))}};export{v as SimulatorMask};