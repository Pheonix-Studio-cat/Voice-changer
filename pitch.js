class PitchShift extends AudioWorkletProcessor{
  static get parameterDescriptors(){return [{name:'ratio',defaultValue:1,minValue:0.25,maxValue:4}]}
  constructor(){super();this.size=16384;this.buf=new Float32Array(this.size);this.w=0;this.win=2048;this.phase=0;}
  process(inputs,outputs,params){
    const inp=inputs[0][0], out=outputs[0];
    if(!inp){return true}
    const r=params.ratio[0], N=this.win, S=this.size, b=this.buf;
    for(let n=0;n<inp.length;n++){
      b[this.w]=inp[n];
      this.phase+=(1-r)/N; this.phase-=Math.floor(this.phase);
      let s=0;
      for(let k=0;k<2;k++){
        const ph=(this.phase+k*0.5)%1, d=ph*N+1;
        let rp=this.w-d; if(rp<0) rp+=S;
        const i0=Math.floor(rp), f=rp-i0, i1=(i0+1)%S;
        const v=b[i0]*(1-f)+b[i1]*f, g=Math.sin(Math.PI*ph);
        s+=v*g*g;
      }
      for(let c=0;c<out.length;c++) out[c][n]=s;
      this.w=(this.w+1)%S;
    }
    return true;
  }
}
registerProcessor('pitch-shift',PitchShift);
