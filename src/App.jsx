import React, { useState, useRef, useCallback, useEffect } from "react";

const STORE_KEY = "tasteprint";
function load(k,d){try{const s=JSON.parse(localStorage.getItem(STORE_KEY)||"{}");return s[k]!==undefined?s[k]:d}catch{return d}}

const FONTS = [
  {name:"DM Sans",family:"'DM Sans',system-ui,sans-serif"},
  {name:"Inter",family:"'Inter',system-ui,sans-serif"},
  {name:"Plus Jakarta Sans",family:"'Plus Jakarta Sans',system-ui,sans-serif"},
  {name:"Manrope",family:"'Manrope',system-ui,sans-serif"},
  {name:"Space Grotesk",family:"'Space Grotesk',system-ui,sans-serif"},
  {name:"Outfit",family:"'Outfit',system-ui,sans-serif"},
  {name:"Sora",family:"'Sora',system-ui,sans-serif"},
  {name:"Work Sans",family:"'Work Sans',system-ui,sans-serif"},
  {name:"Figtree",family:"'Figtree',system-ui,sans-serif"},
  {name:"Instrument Serif",family:"'Instrument Serif',Georgia,serif"},
];

const PAL = {
  warm:  { bg:"#FFF8F2",card:"#FFFFFF",ac:"#E07A5F",ac2:"#F2B880",tx:"#3D2C2C",mu:"#9C8578",bd:"rgba(224,122,95,0.12)",su:"#FDF0E8",name:"Warm" },
  cool:  { bg:"#F4F7FB",card:"#FFFFFF",ac:"#5B8DB8",ac2:"#7CAED4",tx:"#2C3644",mu:"#7A8B9C",bd:"rgba(91,141,184,0.12)",su:"#EBF2F8",name:"Cool" },
  earth: { bg:"#F7F4F0",card:"#FFFFFF",ac:"#8C7B6C",ac2:"#B8A08C",tx:"#3D3630",mu:"#A09488",bd:"rgba(140,123,108,0.12)",su:"#F0ECE6",name:"Earth" },
  noir:  { bg:"#1A1A1E",card:"#242428",ac:"#FFFFFF",ac2:"#888890",tx:"#F0F0F2",mu:"#78787E",bd:"rgba(255,255,255,0.08)",su:"#2A2A2E",name:"Noir" },
  candy: { bg:"#FFF5F9",card:"#FFFFFF",ac:"#E8589C",ac2:"#A864D4",tx:"#3A2434",mu:"#A88898",bd:"rgba(232,88,156,0.12)",su:"#FDE8F2",name:"Candy" },
};

/* ========== M3 COMPONENT VARIANTS ========== */
const VARIANTS = {
  // Actions
  "common-button":     ["Filled","Outlined","Text","Elevated","Tonal"],
  "fab":               ["FAB","Small FAB","Large FAB"],
  "extended-fab":      ["Standard","With icon"],
  "icon-button":       ["Standard","Filled","Tonal","Outlined"],
  "segmented-button":  ["Single select","Multi select"],
  // Communication
  "badge":             ["Small","Large","With number"],
  "progress":          ["Linear","Circular"],
  "snackbar":          ["Single line","Two line","With action"],
  // Containment
  "bottom-sheet":      ["Standard","Modal"],
  "card":              ["Elevated","Filled","Outlined"],
  "carousel":          ["Multi-browse","Uncontained","Hero"],
  "dialog":            ["Basic","Full-screen"],
  "divider":           ["Full width","Inset","Middle inset"],
  "list":              ["One line","Two line","Three line"],
  "side-sheet":        ["Standard","Modal"],
  "tooltip":           ["Plain","Rich"],
  // Navigation
  "bottom-app-bar":    ["With FAB","No FAB"],
  "navigation-bar":    ["3 items","4 items","5 items"],
  "navigation-drawer": ["Standard","Modal"],
  "navigation-rail":   ["No labels","With labels"],
  "search":            ["Search bar","Search view"],
  "tabs":              ["Primary","Secondary"],
  "top-app-bar":       ["Small","Medium","Large"],
  // Selection
  "checkbox":          ["Unchecked","Checked","Indeterminate"],
  "chip":              ["Assist","Filter","Input","Suggestion"],
  "date-picker":       ["Docked","Modal","Input"],
  "menu":              ["Standard","Cascading"],
  "radio-button":      ["Unselected","Selected"],
  "slider":            ["Continuous","Discrete","Range"],
  "switch":            ["Off","On"],
  "time-picker":       ["Dial","Input"],
  // Text inputs
  "text-field":        ["Filled","Outlined"],
  // Toolbars
  "toolbar":           ["Standard","Contextual"],
};

/* ========== M3 COMPONENT LIBRARY (matching m3.material.io) ========== */
const LIB = [
  { cat:"App bars", items:[
    {type:"top-app-bar",label:"Top app bar",w:360,h:64},
    {type:"bottom-app-bar",label:"Bottom app bar",w:360,h:80},
  ]},
  { cat:"Badges", items:[
    {type:"badge",label:"Badge",w:24,h:24},
  ]},
  { cat:"Buttons", items:[
    {type:"common-button",label:"Common button",w:140,h:40},
    {type:"fab",label:"FAB",w:56,h:56},
    {type:"extended-fab",label:"Extended FAB",w:140,h:56},
    {type:"icon-button",label:"Icon button",w:48,h:48},
    {type:"segmented-button",label:"Segmented button",w:280,h:40},
  ]},
  { cat:"Cards", items:[
    {type:"card",label:"Card",w:280,h:180},
  ]},
  { cat:"Carousel", items:[
    {type:"carousel",label:"Carousel",w:360,h:200},
  ]},
  { cat:"Checkbox", items:[
    {type:"checkbox",label:"Checkbox",w:40,h:40},
  ]},
  { cat:"Chips", items:[
    {type:"chip",label:"Chip",w:100,h:32},
  ]},
  { cat:"Date & time pickers", items:[
    {type:"date-picker",label:"Date picker",w:328,h:380},
    {type:"time-picker",label:"Time picker",w:280,h:280},
  ]},
  { cat:"Dialogs", items:[
    {type:"dialog",label:"Dialog",w:312,h:200},
  ]},
  { cat:"Divider", items:[
    {type:"divider",label:"Divider",w:280,h:16},
  ]},
  { cat:"Lists", items:[
    {type:"list",label:"List",w:280,h:180},
  ]},
  { cat:"Loading & progress", items:[
    {type:"progress",label:"Progress indicator",w:200,h:40},
  ]},
  { cat:"Menus", items:[
    {type:"menu",label:"Menu",w:200,h:180},
  ]},
  { cat:"Navigation", items:[
    {type:"navigation-bar",label:"Navigation bar",w:360,h:80},
    {type:"navigation-drawer",label:"Navigation drawer",w:280,h:320},
    {type:"navigation-rail",label:"Navigation rail",w:80,h:280},
  ]},
  { cat:"Radio button", items:[
    {type:"radio-button",label:"Radio button",w:40,h:40},
  ]},
  { cat:"Search", items:[
    {type:"search",label:"Search",w:360,h:56},
  ]},
  { cat:"Sheets", items:[
    {type:"bottom-sheet",label:"Bottom sheet",w:320,h:200},
    {type:"side-sheet",label:"Side sheet",w:280,h:300},
  ]},
  { cat:"Sliders", items:[
    {type:"slider",label:"Slider",w:200,h:40},
  ]},
  { cat:"Snackbar", items:[
    {type:"snackbar",label:"Snackbar",w:320,h:48},
  ]},
  { cat:"Switch", items:[
    {type:"switch",label:"Switch",w:52,h:32},
  ]},
  { cat:"Tabs", items:[
    {type:"tabs",label:"Tabs",w:360,h:48},
  ]},
  { cat:"Text fields", items:[
    {type:"text-field",label:"Text field",w:280,h:56},
  ]},
  { cat:"Toolbars", items:[
    {type:"toolbar",label:"Toolbar",w:360,h:56},
  ]},
  { cat:"Tooltips", items:[
    {type:"tooltip",label:"Tooltip",w:200,h:48},
  ]},
];

function uid(){return Math.random().toString(36).substr(2,9)}
function maxV(t){return(VARIANTS[t]||[]).length||1}
function varName(t,v){return(VARIANTS[t]||[])[v]||"Default"}

function snap(s,all,thr=10){
  const r={x:null,y:null,g:[]}, cx=s.x+s.w/2, cy=s.y+s.h/2;
  for(const o of all){
    if(o.id===s.id)continue;
    const ox=o.x+o.w/2,oy=o.y+o.h/2;
    if(Math.abs(cx-ox)<thr){r.x=ox-s.w/2;r.g.push({t:"v",p:ox})}
    if(Math.abs(cy-oy)<thr){r.y=oy-s.h/2;r.g.push({t:"h",p:oy})}
    if(Math.abs(s.x-o.x)<thr){r.x=o.x;r.g.push({t:"v",p:o.x})}
    if(Math.abs(s.x+s.w-(o.x+o.w))<thr){r.x=o.x+o.w-s.w;r.g.push({t:"v",p:o.x+o.w})}
    if(Math.abs(s.y-o.y)<thr){r.y=o.y;r.g.push({t:"h",p:o.y})}
    if(Math.abs(s.y+s.h-(o.y+o.h))<thr){r.y=o.y+o.h-s.h;r.g.push({t:"h",p:o.y+o.h})}
    for(const g of[12,16,24]){
      if(Math.abs(s.x-(o.x+o.w)-g)<thr){r.x=o.x+o.w+g;r.g.push({t:"v",p:o.x+o.w+g/2})}
      if(Math.abs(s.y-(o.y+o.h)-g)<thr){r.y=o.y+o.h+g;r.g.push({t:"h",p:o.y+o.h+g/2})}
    }
  }
  return r;
}

function Radar({taste,ac}){
  const d=[{k:"density",l:"Dense"},{k:"roundness",l:"Round"},{k:"warmth",l:"Warm"},{k:"complexity",l:"Rich"},{k:"boldness",l:"Bold"}];
  const n=d.length,cx=50,cy=50,R=36;
  const pts=d.map((dm,i)=>{const a=(Math.PI*2*i)/n-Math.PI/2;const v=taste[dm.k]||0;return{x:cx+Math.cos(a)*R*v,y:cy+Math.sin(a)*R*v,lx:cx+Math.cos(a)*(R+13),ly:cy+Math.sin(a)*(R+13),l:dm.l}});
  return(<svg width="100" height="100" viewBox="0 0 100 100">
    {[.33,.66,1].map((s,i)=><polygon key={i} points={d.map((_,j)=>{const a=(Math.PI*2*j)/n-Math.PI/2;return`${cx+Math.cos(a)*R*s},${cy+Math.sin(a)*R*s}`}).join(" ")} fill="none" stroke="rgba(128,128,128,0.1)" strokeWidth="0.5"/>)}
    <polygon points={pts.map(p=>`${p.x},${p.y}`).join(" ")} fill={ac+"18"} stroke={ac} strokeWidth="1.5" strokeLinejoin="round"/>
    {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill={ac}/>)}
    {pts.map((p,i)=><text key={`l${i}`} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="central" fontSize="6.5" fill="rgba(128,128,128,0.5)" fontFamily="system-ui">{p.l}</text>)}
  </svg>);
}

/* ========== M3 ICONS ========== */
const Icons = {
  add: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  check: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  search: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke={c} strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  menu: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  arrow: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  home: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  heart: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={c} strokeWidth="2"/></svg>,
  star: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  settings: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  edit: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  person: (c,s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2"/><path d="M20 21a8 8 0 1 0-16 0" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
};

/* ========== M3 COMPONENT RENDERER ========== */
function C({type,v=0,p,editable,texts={},onText,font=0}){
  const f=FONTS[font]?.family||FONTS[0].family;
  const b={width:"100%",height:"100%",fontFamily:f,overflow:"hidden",boxSizing:"border-box"};

  const T=({k,s,children})=>{
    const val=texts[k]!==undefined?texts[k]:children;
    if(!editable)return <span style={s}>{val}</span>;
    return <span
      contentEditable
      suppressContentEditableWarning
      onBlur={e=>{const t=e.target.innerText.trim();onText?.(k,t||null)}}
      onMouseDown={e=>e.stopPropagation()}
      onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();e.target.blur()}}}
      style={{...s,outline:"none",cursor:"text",minWidth:8}}
    >{val}</span>;
  };

  /* ========== ACTIONS ========== */
  
  /* Common Button - M3 */
  if(type==="common-button"){
    const rad = 20;
    if(v===0) return <div style={{...b,background:p.ac,borderRadius:rad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 3px rgba(0,0,0,.12)"}}><T k="label" s={{color:"#fff",fontSize:14,fontWeight:500,letterSpacing:"0.02em"}}>Filled</T></div>;
    if(v===1) return <div style={{...b,background:"transparent",borderRadius:rad,border:`1px solid ${p.mu}40`,display:"flex",alignItems:"center",justifyContent:"center"}}><T k="label" s={{color:p.ac,fontSize:14,fontWeight:500}}>Outlined</T></div>;
    if(v===2) return <div style={{...b,background:"transparent",borderRadius:rad,display:"flex",alignItems:"center",justifyContent:"center"}}><T k="label" s={{color:p.ac,fontSize:14,fontWeight:500}}>Text</T></div>;
    if(v===3) return <div style={{...b,background:p.su,borderRadius:rad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 2px rgba(0,0,0,.08)"}}><T k="label" s={{color:p.ac,fontSize:14,fontWeight:500}}>Elevated</T></div>;
    return <div style={{...b,background:p.ac+"22",borderRadius:rad,display:"flex",alignItems:"center",justifyContent:"center"}}><T k="label" s={{color:p.ac,fontSize:14,fontWeight:500}}>Tonal</T></div>;
  }

  /* FAB - M3 */
  if(type==="fab"){
    const sizes = [{r:16,s:24,pad:16},{r:12,s:20,pad:8},{r:28,s:36,pad:30}];
    const {r,s:iconS,pad} = sizes[v] || sizes[0];
    return <div style={{...b,background:p.ac+"18",borderRadius:r,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.08)"}}>
      {Icons.add(p.ac, iconS)}
    </div>;
  }

  /* Extended FAB - M3 */
  if(type==="extended-fab"){
    return <div style={{...b,background:p.ac+"18",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"0 20px",boxShadow:"0 3px 5px rgba(0,0,0,.1)"}}>
      {v===1 && Icons.add(p.ac, 20)}
      <T k="label" s={{color:p.ac,fontSize:14,fontWeight:500}}>Create</T>
    </div>;
  }

  /* Icon Button - M3 */
  if(type==="icon-button"){
    if(v===0) return <div style={{...b,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.heart(p.mu,24)}</div>;
    if(v===1) return <div style={{...b,background:p.ac,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.heart("#fff",24)}</div>;
    if(v===2) return <div style={{...b,background:p.ac+"18",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.heart(p.ac,24)}</div>;
    return <div style={{...b,border:`1px solid ${p.mu}40`,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.heart(p.mu,24)}</div>;
  }

  /* Segmented Button - M3 */
  if(type==="segmented-button"){
    const items = ["Day","Week","Month"];
    return <div style={{...b,display:"flex",borderRadius:20,overflow:"hidden",border:`1px solid ${p.mu}30`}}>
      {items.map((item,i)=>(
        <div key={i} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:i===0?p.ac+"18":"transparent",borderRight:i<2?`1px solid ${p.mu}30`:"none"}}>
          {i===0 && v===0 && Icons.check(p.ac,16)}
          <T k={`seg${i}`} s={{fontSize:13,fontWeight:500,color:i===0?p.ac:p.mu}}>{item}</T>
        </div>
      ))}
    </div>;
  }

  /* ========== COMMUNICATION ========== */

  /* Badge - M3 */
  if(type==="badge"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:6,height:6,borderRadius:999,background:p.ac}}/></div>;
    if(v===1) return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:16,height:16,borderRadius:999,background:p.ac}}/></div>;
    return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{minWidth:16,height:16,borderRadius:999,background:p.ac,padding:"0 4px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:12,fontWeight:500,color:"#fff"}}>3</span></div></div>;
  }

  /* Progress Indicator - M3 */
  if(type==="progress"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center"}}><div style={{width:"100%",height:4,borderRadius:2,background:p.ac+"22"}}><div style={{width:"65%",height:"100%",borderRadius:2,background:p.ac}}/></div></div>;
    return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke={p.ac+"22"} strokeWidth="4"/>
        <circle cx="20" cy="20" r="16" fill="none" stroke={p.ac} strokeWidth="4" strokeDasharray="75 100" strokeLinecap="round" transform="rotate(-90 20 20)"/>
      </svg>
    </div>;
  }

  /* Snackbar - M3 */
  if(type==="snackbar"){
    const bg = p.bg==="#1A1A1E" ? "#E8E8EA" : "#323236";
    const tx = p.bg==="#1A1A1E" ? "#1A1A1E" : "#FFFFFF";
    if(v===0) return <div style={{...b,background:bg,borderRadius:4,padding:"0 16px",display:"flex",alignItems:"center"}}><T k="label" s={{fontSize:14,color:tx}}>Single line snackbar</T></div>;
    if(v===1) return <div style={{...b,background:bg,borderRadius:4,padding:"14px 16px",display:"flex",flexDirection:"column",gap:4}}><T k="label" s={{fontSize:14,color:tx}}>Two line snackbar</T><T k="sub" s={{fontSize:12,color:tx,opacity:.7}}>With supporting text</T></div>;
    return <div style={{...b,background:bg,borderRadius:4,padding:"0 8px 0 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><T k="label" s={{fontSize:14,color:tx}}>Snackbar message</T><div style={{padding:"6px 12px",borderRadius:4}}><T k="action" s={{fontSize:14,fontWeight:500,color:p.ac}}>Action</T></div></div>;
  }

  /* ========== CONTAINMENT ========== */

  /* Card - M3 */
  if(type==="card"){
    const skel=(w)=><div style={{height:8,width:w,background:p.mu,opacity:.1,borderRadius:4}}/>;
    if(v===0) return <div style={{...b,background:p.card,borderRadius:12,boxShadow:"0 1px 2px rgba(0,0,0,.05), 0 1px 3px rgba(0,0,0,.1)",padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{height:80,borderRadius:8,background:p.su}}/>{skel("60%")}{skel("90%")}
    </div>;
    if(v===1) return <div style={{...b,background:p.su,borderRadius:12,padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{height:80,borderRadius:8,background:p.ac+"12"}}/>{skel("60%")}{skel("90%")}
    </div>;
    return <div style={{...b,background:p.card,borderRadius:12,border:`1px solid ${p.mu}20`,padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{height:80,borderRadius:8,background:p.su}}/>{skel("60%")}{skel("90%")}
    </div>;
  }

  /* Carousel - M3 */
  if(type==="carousel"){
    return <div style={{...b,display:"flex",gap:8,padding:"8px 0",overflow:"hidden"}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{width:v===2?260:v===1?200:140,height:"100%",flexShrink:0,background:i===0?p.ac+"14":p.su,borderRadius:16,border:`1px solid ${p.bd}`}}/>
      ))}
    </div>;
  }

  /* Dialog - M3 */
  if(type==="dialog"){
    if(v===1) return <div style={{...b,background:p.card,borderRadius:0,display:"flex",flexDirection:"column"}}>
      <div style={{height:56,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${p.bd}`}}>
        {Icons.close(p.tx,24)}
        <T k="title" s={{fontSize:18,fontWeight:500,color:p.tx}}>Full-screen</T>
        <T k="action" s={{fontSize:14,fontWeight:500,color:p.ac}}>Save</T>
      </div>
      <div style={{flex:1,padding:24}}/>
    </div>;
    return <div style={{...b,background:p.card,borderRadius:28,padding:24,display:"flex",flexDirection:"column",gap:16,boxShadow:"0 8px 32px rgba(0,0,0,.15)"}}>
      <T k="title" s={{fontSize:24,fontWeight:400,color:p.tx}}>Dialog title</T>
      <T k="body" s={{fontSize:14,color:p.mu,lineHeight:1.5}}>Dialog description text goes here and explains what this dialog is about.</T>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:"auto"}}>
        <div style={{padding:"10px 16px"}}><T k="cancel" s={{fontSize:14,fontWeight:500,color:p.ac}}>Cancel</T></div>
        <div style={{padding:"10px 24px",background:p.ac,borderRadius:20}}><T k="confirm" s={{fontSize:14,fontWeight:500,color:"#fff"}}>Confirm</T></div>
      </div>
    </div>;
  }

  /* Divider - M3 */
  if(type==="divider"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center"}}><div style={{width:"100%",height:1,background:p.mu+"20"}}/></div>;
    if(v===1) return <div style={{...b,display:"flex",alignItems:"center",padding:"0 16px"}}><div style={{width:"100%",height:1,background:p.mu+"20"}}/></div>;
    return <div style={{...b,display:"flex",alignItems:"center",padding:"0 56px"}}><div style={{width:"100%",height:1,background:p.mu+"20"}}/></div>;
  }

  /* List - M3 */
  if(type==="list"){
    const items = [{title:"List item 1",sub:"Supporting text"},{title:"List item 2",sub:"Supporting text"},{title:"List item 3",sub:"Supporting text"}];
    return <div style={{...b,display:"flex",flexDirection:"column"}}>
      {items.map((item,i)=>(
        <div key={i} style={{height:v===0?56:v===1?72:88,padding:"0 16px",display:"flex",alignItems:"center",gap:16,borderBottom:`1px solid ${p.bd}`}}>
          <div style={{width:40,height:40,borderRadius:999,background:p.su,flexShrink:0}}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
            <T k={`t${i}`} s={{fontSize:16,color:p.tx}}>{item.title}</T>
            {v>0 && <T k={`s${i}`} s={{fontSize:14,color:p.mu}}>{item.sub}</T>}
          </div>
          {Icons.arrow(p.mu,20)}
        </div>
      ))}
    </div>;
  }

  /* Tooltip - M3 */
  if(type==="tooltip"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:p.tx,borderRadius:4,padding:"6px 8px"}}><T k="label" s={{fontSize:12,color:p.bg}}>Plain tooltip</T></div>
    </div>;
    return <div style={{...b,background:p.card,borderRadius:12,padding:12,boxShadow:"0 2px 8px rgba(0,0,0,.15)",display:"flex",flexDirection:"column",gap:4}}>
      <T k="title" s={{fontSize:14,fontWeight:500,color:p.tx}}>Rich tooltip</T>
      <T k="sub" s={{fontSize:12,color:p.mu}}>Supporting text with more detail</T>
    </div>;
  }

  /* Bottom Sheet - M3 */
  if(type==="bottom-sheet"){
    return <div style={{...b,background:p.card,borderRadius:"28px 28px 0 0",padding:16,display:"flex",flexDirection:"column",gap:16,boxShadow:"0 -4px 20px rgba(0,0,0,.1)"}}>
      <div style={{width:32,height:4,borderRadius:2,background:p.mu+"40",margin:"0 auto"}}/>
      <T k="title" s={{fontSize:16,fontWeight:500,color:p.tx}}>Bottom sheet</T>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
        {[1,2,3].map(i=><div key={i} style={{height:48,borderRadius:8,background:p.su}}/>)}
      </div>
    </div>;
  }

  /* Side Sheet - M3 */
  if(type==="side-sheet"){
    return <div style={{...b,background:p.card,borderRadius:v===1?28:0,padding:24,display:"flex",flexDirection:"column",gap:16,borderLeft:v===0?`1px solid ${p.bd}`:"none",boxShadow:v===1?"0 0 30px rgba(0,0,0,.15)":"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <T k="title" s={{fontSize:18,fontWeight:500,color:p.tx}}>Side sheet</T>
        {Icons.close(p.mu,24)}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
        {[1,2,3,4].map(i=><div key={i} style={{height:44,borderRadius:8,background:p.su}}/>)}
      </div>
    </div>;
  }

  /* ========== NAVIGATION ========== */

  /* Bottom App Bar - M3 */
  if(type==="bottom-app-bar"){
    return <div style={{...b,background:p.su,display:"flex",alignItems:"center",padding:"0 16px",position:"relative"}}>
      <div style={{display:"flex",gap:24}}>
        {Icons.menu(p.tx,24)}
        {Icons.search(p.tx,24)}
        {Icons.edit(p.tx,24)}
      </div>
      {v===0 && <div style={{position:"absolute",right:16,width:56,height:56,borderRadius:16,background:p.ac+"18",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,.1)"}}>
        {Icons.add(p.ac,24)}
      </div>}
    </div>;
  }

  /* Navigation Bar - M3 */
  if(type==="navigation-bar"){
    const items = ["Home","Search","Favorites","Profile"].slice(0, v===0?3:v===1?4:5);
    const icons = [Icons.home,Icons.search,Icons.heart,Icons.person];
    return <div style={{...b,background:p.su,display:"flex",alignItems:"center",justifyContent:"space-around"}}>
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 0"}}>
          <div style={{width:64,height:32,borderRadius:16,background:i===0?p.ac+"18":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {icons[i](i===0?p.ac:p.mu,24)}
          </div>
          <span style={{fontSize:12,fontWeight:i===0?500:400,color:i===0?p.ac:p.mu}}>{item}</span>
        </div>
      ))}
    </div>;
  }

  /* Navigation Drawer - M3 */
  if(type==="navigation-drawer"){
    const items = ["Inbox","Outbox","Favorites","Trash"];
    return <div style={{...b,background:p.card,padding:12,display:"flex",flexDirection:"column",gap:4,borderRadius:v===1?16:0}}>
      <div style={{padding:"16px 16px 24px"}}><T k="title" s={{fontSize:14,fontWeight:500,color:p.mu}}>Mail</T></div>
      {items.map((item,i)=>(
        <div key={i} style={{height:56,borderRadius:28,padding:"0 16px 0 24px",display:"flex",alignItems:"center",gap:12,background:i===0?p.ac+"14":"transparent"}}>
          {[Icons.home,Icons.edit,Icons.heart,Icons.close][i](i===0?p.ac:p.mu,24)}
          <span style={{fontSize:14,fontWeight:i===0?500:400,color:i===0?p.ac:p.tx}}>{item}</span>
          {i===0 && <span style={{marginLeft:"auto",fontSize:12,fontWeight:500,color:p.ac}}>24</span>}
        </div>
      ))}
    </div>;
  }

  /* Navigation Rail - M3 */
  if(type==="navigation-rail"){
    const items = ["Home","Search","Star"];
    const icons = [Icons.home,Icons.search,Icons.star];
    return <div style={{...b,background:p.su,display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 0",gap:12}}>
      <div style={{width:56,height:56,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {Icons.menu(p.tx,24)}
      </div>
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:56,height:32,borderRadius:16,background:i===0?p.ac+"18":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {icons[i](i===0?p.ac:p.mu,24)}
          </div>
          {v===1 && <span style={{fontSize:12,fontWeight:i===0?500:400,color:i===0?p.ac:p.mu}}>{item}</span>}
        </div>
      ))}
    </div>;
  }

  /* Search - M3 */
  if(type==="search"){
    if(v===0) return <div style={{...b,background:p.su,borderRadius:28,padding:"0 16px",display:"flex",alignItems:"center",gap:12}}>
      {Icons.search(p.mu,24)}
      <T k="ph" s={{fontSize:16,color:p.mu}}>Search</T>
      <div style={{marginLeft:"auto",width:32,height:32,borderRadius:999,background:p.ac+"12"}}/>
    </div>;
    return <div style={{...b,background:p.card,borderRadius:28,padding:"8px 16px",display:"flex",flexDirection:"column",gap:8,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {Icons.arrow(p.mu,24)}
        <T k="q" s={{fontSize:16,color:p.tx,flex:1}}>Search query</T>
        {Icons.close(p.mu,24)}
      </div>
      <div style={{borderTop:`1px solid ${p.bd}`,paddingTop:8}}>
        {["Recent 1","Recent 2"].map((r,i)=><div key={i} style={{padding:"12px 0",fontSize:14,color:p.mu}}>{r}</div>)}
      </div>
    </div>;
  }

  /* Tabs - M3 */
  if(type==="tabs"){
    const items = ["Tab 1","Tab 2","Tab 3"];
    if(v===0) return <div style={{...b,display:"flex",borderBottom:`1px solid ${p.bd}`}}>
      {items.map((t,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:0}}>
          <span style={{fontSize:14,fontWeight:500,color:i===0?p.ac:p.mu,paddingBottom:14}}>{t}</span>
          <div style={{width:"100%",height:3,borderRadius:"3px 3px 0 0",background:i===0?p.ac:"transparent"}}/>
        </div>
      ))}
    </div>;
    return <div style={{...b,display:"flex",borderBottom:`1px solid ${p.bd}`}}>
      {items.map((t,i)=>(
        <div key={i} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:14,fontWeight:500,color:i===0?p.tx:p.mu,paddingBottom:12,borderBottom:i===0?`2px solid ${p.ac}`:"2px solid transparent"}}>{t}</span>
        </div>
      ))}
    </div>;
  }

  /* Top App Bar - M3 */
  if(type==="top-app-bar"){
    if(v===0) return <div style={{...b,background:p.su,padding:"0 8px",display:"flex",alignItems:"center"}}>
      {Icons.menu(p.tx,24)}
      <T k="title" s={{fontSize:22,fontWeight:400,color:p.tx,marginLeft:16}}>Title</T>
      <div style={{marginLeft:"auto",display:"flex",gap:8}}>{Icons.search(p.tx,24)}{Icons.settings(p.tx,24)}</div>
    </div>;
    if(v===1) return <div style={{...b,background:p.su,padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center"}}>{Icons.arrow(p.tx,24)}<div style={{marginLeft:"auto"}}>{Icons.settings(p.tx,24)}</div></div>
      <T k="title" s={{fontSize:24,fontWeight:400,color:p.tx}}>Medium title</T>
    </div>;
    return <div style={{...b,background:p.su,padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center"}}>{Icons.arrow(p.tx,24)}<div style={{marginLeft:"auto"}}>{Icons.settings(p.tx,24)}</div></div>
      <T k="title" s={{fontSize:32,fontWeight:400,color:p.tx}}>Large title</T>
    </div>;
  }

  /* ========== SELECTION ========== */

  /* Checkbox - M3 */
  if(type==="checkbox"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:18,height:18,borderRadius:2,border:`2px solid ${p.mu}`}}/></div>;
    if(v===1) return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:18,height:18,borderRadius:2,background:p.ac,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.check("#fff",14)}</div></div>;
    return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:18,height:18,borderRadius:2,background:p.ac,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:10,height:2,background:"#fff"}}/></div></div>;
  }

  /* Chip - M3 */
  if(type==="chip"){
    if(v===0) return <div style={{...b,border:`1px solid ${p.mu}30`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"0 12px"}}>{Icons.star(p.mu,18)}<T k="label" s={{fontSize:14,color:p.tx}}>Assist</T></div>;
    if(v===1) return <div style={{...b,background:p.ac+"18",border:`1px solid ${p.ac}30`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"0 8px 0 4px"}}><div style={{width:18,height:18,borderRadius:999,background:p.ac,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.check("#fff",12)}</div><T k="label" s={{fontSize:14,color:p.ac}}>Filter</T></div>;
    if(v===2) return <div style={{...b,border:`1px solid ${p.mu}30`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"0 4px 0 12px"}}><T k="label" s={{fontSize:14,color:p.tx}}>Input</T>{Icons.close(p.mu,18)}</div>;
    return <div style={{...b,border:`1px solid ${p.mu}30`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 12px"}}><T k="label" s={{fontSize:14,color:p.tx}}>Suggestion</T></div>;
  }

  /* Date Picker - M3 */
  if(type==="date-picker"){
    const days = ["S","M","T","W","T","F","S"];
    return <div style={{...b,background:p.card,borderRadius:28,padding:20,display:"flex",flexDirection:"column",gap:16,boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <T k="month" s={{fontSize:14,fontWeight:500,color:p.tx}}>March 2026</T>
        <div style={{display:"flex",gap:4}}>{Icons.arrow(p.tx,20)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {days.map((d,i)=><div key={i} style={{height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:p.mu}}>{d}</div>)}
        {Array(31).fill(0).map((_,i)=>(
          <div key={i} style={{height:36,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,background:i===14?p.ac:"transparent",color:i===14?"#fff":p.tx}}>{i+1}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <T k="cancel" s={{fontSize:14,fontWeight:500,color:p.ac,padding:"8px 12px"}}>Cancel</T>
        <T k="ok" s={{fontSize:14,fontWeight:500,color:p.ac,padding:"8px 12px"}}>OK</T>
      </div>
    </div>;
  }

  /* Menu - M3 */
  if(type==="menu"){
    const items = ["Edit","Duplicate","Archive","Delete"];
    return <div style={{...b,background:p.card,borderRadius:4,padding:"8px 0",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>
      {items.map((item,i)=>(
        <div key={i} style={{height:40,padding:"0 12px",display:"flex",alignItems:"center",gap:12,background:i===0?p.ac+"08":"transparent"}}>
          {[Icons.edit,Icons.add,Icons.star,Icons.close][i](p.tx,20)}
          <span style={{fontSize:14,color:i===3?"#E53935":p.tx}}>{item}</span>
        </div>
      ))}
    </div>;
  }

  /* Radio Button - M3 */
  if(type==="radio-button"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:20,height:20,borderRadius:999,border:`2px solid ${p.mu}`}}/></div>;
    return <div style={{...b,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:20,height:20,borderRadius:999,border:`2px solid ${p.ac}`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:10,height:10,borderRadius:999,background:p.ac}}/></div></div>;
  }

  /* Slider - M3 */
  if(type==="slider"){
    if(v===0) return <div style={{...b,display:"flex",alignItems:"center",padding:"0 8px"}}>
      <div style={{flex:1,height:4,borderRadius:2,background:p.ac+"22",position:"relative"}}>
        <div style={{width:"45%",height:"100%",borderRadius:2,background:p.ac}}/>
        <div style={{position:"absolute",left:"45%",top:-8,width:20,height:20,borderRadius:999,background:p.ac,transform:"translateX(-50%)",boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}/>
      </div>
    </div>;
    if(v===1) return <div style={{...b,display:"flex",alignItems:"center",padding:"0 8px"}}>
      <div style={{flex:1,height:4,borderRadius:2,background:p.ac+"22",position:"relative",display:"flex"}}>
        {[0,25,50,75,100].map((_,i)=><div key={i} style={{position:"absolute",left:`${i*25}%`,top:-2,width:4,height:8,borderRadius:2,background:i<3?p.ac:p.ac+"40"}}/>)}
        <div style={{width:"45%",height:"100%",borderRadius:2,background:p.ac}}/>
        <div style={{position:"absolute",left:"45%",top:-8,width:20,height:20,borderRadius:999,background:p.ac,transform:"translateX(-50%)"}}/>
      </div>
    </div>;
    return <div style={{...b,display:"flex",alignItems:"center",padding:"0 8px"}}>
      <div style={{flex:1,height:4,borderRadius:2,background:p.ac+"22",position:"relative"}}>
        <div style={{position:"absolute",left:"25%",width:"35%",height:"100%",borderRadius:2,background:p.ac}}/>
        <div style={{position:"absolute",left:"25%",top:-8,width:20,height:20,borderRadius:999,background:p.ac,transform:"translateX(-50%)"}}/>
        <div style={{position:"absolute",left:"60%",top:-8,width:20,height:20,borderRadius:999,background:p.ac,transform:"translateX(-50%)"}}/>
      </div>
    </div>;
  }

  /* Switch - M3 */
  if(type==="switch"){
    if(v===0) return <div style={{...b,background:p.mu+"30",borderRadius:999,padding:4,display:"flex",alignItems:"center",border:`2px solid ${p.mu}`}}>
      <div style={{width:16,height:16,borderRadius:999,background:p.mu}}/>
    </div>;
    return <div style={{...b,background:p.ac,borderRadius:999,padding:4,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
      <div style={{width:24,height:24,borderRadius:999,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.check(p.ac,16)}</div>
    </div>;
  }

  /* Time Picker - M3 */
  if(type==="time-picker"){
    if(v===0) return <div style={{...b,background:p.card,borderRadius:28,padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:16,boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
      <T k="title" s={{fontSize:12,fontWeight:500,color:p.mu,alignSelf:"flex-start"}}>Select time</T>
      <div style={{width:200,height:200,borderRadius:999,background:p.su,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:8,height:8,borderRadius:999,background:p.ac}}/>
        <div style={{position:"absolute",width:2,height:70,background:p.ac,transformOrigin:"bottom",transform:"rotate(-30deg)",bottom:"50%"}}/>
        {[12,1,2,3,4,5,6,7,8,9,10,11].map((n,i)=>{
          const angle = (i * 30 - 90) * Math.PI / 180;
          const r = 72;
          return <span key={i} style={{position:"absolute",fontSize:14,color:p.tx,left:`calc(50% + ${Math.cos(angle)*r}px - 8px)`,top:`calc(50% + ${Math.sin(angle)*r}px - 8px)`}}>{n}</span>;
        })}
      </div>
      <div style={{display:"flex",gap:8}}>
        <T k="cancel" s={{fontSize:14,fontWeight:500,color:p.ac,padding:"8px 12px"}}>Cancel</T>
        <T k="ok" s={{fontSize:14,fontWeight:500,color:p.ac,padding:"8px 12px"}}>OK</T>
      </div>
    </div>;
    return <div style={{...b,background:p.card,borderRadius:28,padding:24,display:"flex",flexDirection:"column",gap:16,boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
      <T k="title" s={{fontSize:12,fontWeight:500,color:p.mu}}>Enter time</T>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <div style={{width:96,height:72,borderRadius:8,background:p.ac+"14",border:`2px solid ${p.ac}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:45,color:p.ac}}>10</span></div>
        <span style={{fontSize:45,color:p.tx}}>:</span>
        <div style={{width:96,height:72,borderRadius:8,background:p.su,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:45,color:p.tx}}>30</span></div>
        <div style={{display:"flex",flexDirection:"column",borderRadius:8,overflow:"hidden",border:`1px solid ${p.bd}`}}>
          <div style={{padding:"8px 12px",background:p.ac+"14"}}><span style={{fontSize:14,fontWeight:500,color:p.ac}}>AM</span></div>
          <div style={{padding:"8px 12px"}}><span style={{fontSize:14,color:p.mu}}>PM</span></div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <T k="cancel" s={{fontSize:14,fontWeight:500,color:p.ac,padding:"8px 12px"}}>Cancel</T>
        <T k="ok" s={{fontSize:14,fontWeight:500,color:p.ac,padding:"8px 12px"}}>OK</T>
      </div>
    </div>;
  }

  /* ========== TEXT INPUTS ========== */

  /* Text Field - M3 */
  if(type==="text-field"){
    if(v===0) return <div style={{...b,background:p.su,borderRadius:"4px 4px 0 0",borderBottom:`2px solid ${p.ac}`,padding:"8px 16px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <T k="label" s={{fontSize:12,color:p.ac}}>Label</T>
      <T k="value" s={{fontSize:16,color:p.tx}}>Input text</T>
    </div>;
    return <div style={{...b,background:"transparent",borderRadius:4,border:`1px solid ${p.mu}50`,padding:"8px 16px",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative"}}>
      <span style={{position:"absolute",top:-8,left:12,background:p.bg,padding:"0 4px",fontSize:12,color:p.ac}}>Label</span>
      <T k="value" s={{fontSize:16,color:p.tx,marginTop:4}}>Input text</T>
    </div>;
  }

  /* Toolbar - M3 */
  if(type==="toolbar"){
    if(v===0) return <div style={{...b,background:p.su,padding:"0 8px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{display:"flex",gap:4}}>
        {Icons.edit(p.tx,20)}
        {Icons.add(p.tx,20)}
        {Icons.star(p.tx,20)}
      </div>
      <div style={{flex:1}}/>
      <div style={{display:"flex",gap:4}}>
        {Icons.search(p.tx,20)}
        {Icons.settings(p.tx,20)}
      </div>
    </div>;
    return <div style={{...b,background:p.ac,padding:"0 8px",display:"flex",alignItems:"center",gap:8}}>
      {Icons.close("#fff",20)}
      <span style={{fontSize:14,fontWeight:500,color:"#fff",marginLeft:8}}>3 selected</span>
      <div style={{flex:1}}/>
      <div style={{display:"flex",gap:4}}>
        {Icons.edit("#fff",20)}
        {Icons.star("#fff",20)}
        {Icons.close("#fff",20)}
      </div>
    </div>;
  }

  return <div style={{...b,background:p.su,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:12,color:p.mu}}>Unknown</span></div>;
}

/* ========== MAIN APP ========== */
export default function App(){
  const [shapes,setShapes]=useState(()=>load("shapes",[]));
  const [sel,setSel]=useState(null);
  const [drag,setDrag]=useState(null);
  const [off,setOff]=useState({x:0,y:0});
  const [guides,setGuides]=useState([]);
  const [pal,setPal]=useState(()=>load("pal","warm"));
  const [taste,setTaste]=useState(()=>load("taste",{density:.2,roundness:.3,warmth:.5,complexity:.2,boldness:.3}));
  const [gest,setGest]=useState(()=>load("gest",0));
  const [hist,setHist]=useState([]);
  const [rsz,setRsz]=useState(null);
  const [expCat,setExpCat]=useState(["App bars","Badges","Buttons","Cards","Carousel","Checkbox","Chips","Date & time pickers","Dialogs","Divider","Lists","Loading & progress","Menus","Navigation","Radio button","Search","Sheets","Sliders","Snackbar","Switch","Tabs","Text fields","Toolbars","Tooltips"]); // All expanded
  const [prefV,setPrefV]=useState(()=>load("prefV",{}));
  const [hov,setHov]=useState(null);
  const [cam,setCam]=useState({x:0,y:0,z:1});
  const [pan,setPan]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [isMobile,setIsMobile]=useState(typeof window!=='undefined'&&window.innerWidth<768);
  const [sidebarWidth,setSidebarWidth]=useState(()=>load("sidebarWidth",240));
  const [sidebarResizing,setSidebarResizing]=useState(false);
  const cRef=useRef(null);
  const dRef=useRef(null);
  const camRef=useRef(cam);
  camRef.current=cam;
  
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);

  useEffect(()=>{
    localStorage.setItem(STORE_KEY,JSON.stringify({shapes,pal,taste,prefV,gest,sidebarWidth}));
  },[shapes,pal,taste,prefV,gest,sidebarWidth]);

  // Sidebar resize handlers
  const onSidebarResizeStart = useCallback((e) => {
    e.preventDefault();
    setSidebarResizing(true);
  }, []);

  useEffect(() => {
    if (!sidebarResizing) return;
    const onMove = (e) => {
      const newWidth = Math.max(280, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
    };
    const onUp = () => setSidebarResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [sidebarResizing]);

  const exportJSON=useCallback(()=>{
    const data=JSON.stringify({shapes,pal,taste,prefV,gest},null,2);
    const blob=new Blob([data],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="tasteprint.json";a.click();
    URL.revokeObjectURL(url);
  },[shapes,pal,taste,prefV,gest]);

  const importJSON=useCallback(()=>{
    const input=document.createElement("input");
    input.type="file";input.accept=".json";
    input.onchange=e=>{
      const file=e.target.files[0];if(!file)return;
      const reader=new FileReader();
      reader.onload=ev=>{
        try{
          const d=JSON.parse(ev.target.result);
          if(d.shapes)setShapes(d.shapes);
          if(d.pal)setPal(d.pal);
          if(d.taste)setTaste(d.taste);
          if(d.prefV)setPrefV(d.prefV);
          if(d.gest!==undefined)setGest(d.gest);
        }catch{}
      };
      reader.readAsText(file);
    };
    input.click();
  },[]);

  const toCanvas=useCallback((cx,cy)=>{
    const r=cRef.current.getBoundingClientRect();
    const c=camRef.current;
    return{x:(cx-r.left-c.x)/c.z,y:(cy-r.top-c.y)/c.z};
  },[]);

  const push=useCallback(ns=>{setHist(h=>[...h.slice(-40),shapes]);setShapes(ns)},[shapes]);
  const undo=useCallback(()=>{if(!hist.length)return;setShapes(hist[hist.length-1]);setHist(h=>h.slice(0,-1))},[hist]);
  const nudge=useCallback(d=>{setGest(g=>g+1);setTaste(prev=>{const t={...prev};for(const[k,val]of Object.entries(d))t[k]=Math.max(0,Math.min(1,(t[k]||0)+val));return t})},[]);

  const cycle=useCallback((id,dir)=>{
    const s=shapes.find(x=>x.id===id);if(!s)return;
    const mx=maxV(s.type);let nv=((s.variant||0)+dir)%mx;if(nv<0)nv=mx-1;
    setShapes(shapes.map(x=>x.id===id?{...x,variant:nv}:x));
    setPrefV(pv=>({...pv,[s.type]:nv}));
    nudge({complexity:.01});
  },[shapes,nudge]);

  const updateText=useCallback((id,k,val)=>{
    setShapes(shapes.map(s=>s.id===id?{...s,texts:{...s.texts,[k]:val}}:s));
  },[shapes]);

  const onDrop=useCallback(e=>{
    e.preventDefault();
    const info=dRef.current;if(!info)return;
    const pt=toCanvas(e.clientX,e.clientY);
    const ns={id:uid(),type:info.type,x:pt.x-info.w/2,y:pt.y-info.h/2,w:info.w,h:info.h,variant:prefV[info.type]||0,texts:{},font:0};
    const sn=snap(ns,shapes);if(sn.x!==null)ns.x=sn.x;if(sn.y!==null)ns.y=sn.y;
    push([...shapes,ns]);setSel(ns.id);nudge({complexity:.02});dRef.current=null;
  },[shapes,push,nudge,prefV,toCanvas]);

  const onDown=useCallback((e,s)=>{
    e.stopPropagation();setSel(s.id);setDrag(s.id);
    const pt=toCanvas(e.clientX,e.clientY);
    setOff({x:pt.x-s.x,y:pt.y-s.y});
  },[toCanvas]);

  const onMove=useCallback(e=>{
    if(pan){
      setCam(c=>({...c,x:c.x+(e.clientX-pan.x),y:c.y+(e.clientY-pan.y)}));
      setPan({x:e.clientX,y:e.clientY});
      return;
    }
    if(!drag&&!rsz)return;
    const pt=toCanvas(e.clientX,e.clientY);
    if(rsz){const s=shapes.find(x=>x.id===rsz);if(!s)return;setShapes(shapes.map(x=>x.id===rsz?{...x,w:Math.max(40,pt.x-x.x),h:Math.max(20,pt.y-x.y)}:x));return}
    if(drag){let nx=pt.x-off.x,ny=pt.y-off.y;const s=shapes.find(x=>x.id===drag);if(!s)return;const sn=snap({...s,x:nx,y:ny},shapes);if(sn.x!==null)nx=sn.x;if(sn.y!==null)ny=sn.y;setGuides(sn.g);setShapes(shapes.map(x=>x.id===drag?{...x,x:nx,y:ny}:x))}
  },[drag,rsz,shapes,off,pan,toCanvas]);

  const onUp=useCallback(()=>{
    if(pan)setPan(null);
    if(drag){nudge({density:.01});setDrag(null);setGuides([])}
    if(rsz)setRsz(null);
  },[drag,rsz,nudge,pan]);

  const onDel=useCallback(()=>{if(!sel)return;push(shapes.filter(s=>s.id!==sel));setSel(null)},[sel,shapes,push]);

  useEffect(()=>{const h=e=>{if((e.key==="Backspace"||e.key==="Delete")&&!e.target.isContentEditable){e.preventDefault();onDel()}if((e.metaKey||e.ctrlKey)&&e.key==="z"){e.preventDefault();undo()}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[onDel,undo]);

  useEffect(()=>{
    const el=cRef.current;if(!el)return;
    const h=e=>{
      e.preventDefault();
      if(e.ctrlKey||e.metaKey){
        const r=el.getBoundingClientRect();
        const mx=e.clientX-r.left,my=e.clientY-r.top;
        const dz=e.deltaY>0?0.92:1.08;
        setCam(c=>{const nz=Math.max(.15,Math.min(4,c.z*dz));return{x:mx-(mx-c.x)*(nz/c.z),y:my-(my-c.y)*(nz/c.z),z:nz}});
      }else{
        setCam(c=>({...c,x:c.x-e.deltaX,y:c.y-e.deltaY}));
      }
    };
    el.addEventListener("wheel",h,{passive:false});
    return()=>el.removeEventListener("wheel",h);
  },[]);

  const p=PAL[pal];
  const btnSt={background:"none",border:`1px solid ${p.bd}`,borderRadius:8,padding:"5px 12px",fontSize:12,color:p.mu,cursor:"pointer",fontFamily:"inherit"};
  const zoomPct=Math.round(cam.z*100);

  return(
    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:p.bg,fontFamily:"'DM Sans',system-ui,sans-serif",color:p.tx,transition:"background .4s,color .4s"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&family=Figtree:wght@400;500;600;700&family=Instrument+Serif&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"8px 12px":"10px 20px",borderBottom:`1px solid ${p.bd}`,background:p.card+"cc",backdropFilter:"blur(12px)",zIndex:50,transition:"all .4s",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {isMobile&&<button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{width:32,height:32,borderRadius:8,border:`1px solid ${p.bd}`,background:sidebarOpen?p.ac+"22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.tx} strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>}
          <span style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:isMobile?24:32,color:p.tx,letterSpacing:"-0.02em"}}>Tasteprint</span>
          {!isMobile&&<span style={{fontSize:12,color:p.mu,letterSpacing:"0.1em",textTransform:"uppercase"}}>M3 playground</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:isMobile?6:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:isMobile?3:5}}>{Object.entries(PAL).map(([k,v])=><button key={k} onClick={()=>setPal(k)} title={v.name} style={{width:isMobile?18:20,height:isMobile?18:20,borderRadius:999,border:pal===k?`2px solid ${p.ac}`:"2px solid transparent",background:k==="noir"?"#1A1A1E":v.ac,cursor:"pointer",transition:"all .2s",transform:pal===k?"scale(1.2)":"scale(1)"}}/>)}</div>
          {!isMobile&&<><div style={{width:1,height:20,background:p.bd}}/>
          <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:12,color:p.mu}}>{gest}</span><Radar taste={taste} ac={p.ac}/></div>
          <div style={{width:1,height:20,background:p.bd}}/></>}
          <button onClick={exportJSON} style={btnSt}>Export</button>
          <button onClick={importJSON} style={btnSt}>Import</button>
          <button onClick={undo} style={btnSt}>Undo</button>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
        {/* LIBRARY - Sidebar */}
        <div style={{
          width:isMobile?340:sidebarWidth,
          padding:"10px 0",
          overflowY:"auto",
          borderRight:`1px solid ${p.bd}`,
          background:p.card,
          backdropFilter:"blur(8px)",
          flexShrink:0,
          transition:sidebarResizing?"none":"transform .3s ease, opacity .3s ease",
          position:isMobile?"absolute":"relative",
          left:0,top:0,bottom:0,
          zIndex:isMobile?100:1,
          transform:isMobile&&!sidebarOpen?"translateX(-100%)":"translateX(0)",
          boxShadow:isMobile&&sidebarOpen?`4px 0 20px ${p.tx}15`:"none"
        }}>
          {/* Resize handle */}
          {!isMobile && (
            <div 
              onMouseDown={onSidebarResizeStart}
              style={{
                position:"absolute",
                right:0,
                top:0,
                bottom:0,
                width:6,
                cursor:"col-resize",
                background:sidebarResizing?p.ac:"transparent",
                transition:"background .15s",
                zIndex:10
              }}
              onMouseEnter={e=>e.currentTarget.style.background=p.ac+"40"}
              onMouseLeave={e=>{if(!sidebarResizing)e.currentTarget.style.background="transparent"}}
            />
          )}
          <div style={{padding:"2px 14px 8px",fontSize:12,color:p.mu,textTransform:"uppercase",letterSpacing:"0.1em",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>M3 Components</span>
            {isMobile&&<button onClick={()=>setSidebarOpen(false)} style={{background:"none",border:"none",padding:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.mu} strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>}
          </div>
          {isMobile&&<div style={{padding:"0 14px 10px",fontSize:12,color:p.mu,opacity:.7}}>Tap to add to canvas</div>}
          {LIB.map(cat=>{
            const isExpanded = expCat.includes(cat.cat);
            return (
            <div key={cat.cat}>
              <div onClick={()=>setExpCat(isExpanded ? expCat.filter(c=>c!==cat.cat) : [...expCat, cat.cat])} style={{padding:"8px 14px",fontSize:12,fontWeight:600,color:isExpanded?p.tx:p.mu,cursor:"pointer",userSelect:"none",borderBottom:`1px solid ${p.bd}`}}><span style={{display:"inline-block",width:14,fontSize:12,transition:"transform .2s",transform:isExpanded?"rotate(90deg)":"rotate(0)"}}>▶</span> {cat.cat}</div>
              {isExpanded&&(
                <div style={{padding:"4px 8px 8px",display:"flex",flexDirection:"column",gap:4}}>
                  {cat.items.map(item=>{
                    const pv=prefV[item.type]||0;const vn=varName(item.type,pv);
                    return(
                      <div key={item.type} draggable onDragStart={()=>{dRef.current=item}}
                        onClick={()=>{
                          if(isMobile){
                            const ns={id:uid(),type:item.type,x:150,y:150,w:item.w,h:item.h,variant:prefV[item.type]||0,texts:{},font:0};
                            push([...shapes,ns]);setSel(ns.id);setSidebarOpen(false);
                          }
                        }}
                        style={{padding:"6px 8px",borderRadius:8,cursor:isMobile?"pointer":"grab",display:"flex",alignItems:"center",gap:10,transition:"background .12s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=p.su} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{width:56,height:38,borderRadius:6,overflow:"hidden",flexShrink:0,pointerEvents:"none",border:`1px solid ${p.bd}`,background:p.su,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <div style={{transform:`scale(${Math.min(56/item.w,38/item.h)*0.8})`,transformOrigin:"center",width:item.w,height:item.h}}><C type={item.type} v={pv} p={p}/></div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:1,minWidth:0}}>
                          <span style={{fontSize:12,fontWeight:500,color:p.tx}}>{item.label}</span>
                          <span style={{fontSize:12,color:p.mu}}>{vn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );})}
        </div>

        {/* Mobile sidebar overlay */}
        {isMobile&&sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",zIndex:99}}/>}

        {/* CANVAS */}
        <div ref={cRef} onDrop={onDrop} onDragOver={e=>e.preventDefault()} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchMove={e=>{
            if(drag&&e.touches[0]){
              const touch=e.touches[0];
              onMove({clientX:touch.clientX,clientY:touch.clientY,preventDefault:()=>{}});
            }
          }}
          onTouchEnd={onUp}
          onMouseDown={e=>{
            if(e.button===1){e.preventDefault();setPan({x:e.clientX,y:e.clientY})}
            if(e.button===0&&(e.target===cRef.current||e.target.closest("[data-c]")))setSel(null);
          }}
          onContextMenu={e=>e.preventDefault()}
          style={{flex:1,position:"relative",overflow:"hidden",cursor:pan?"grabbing":"default",touchAction:drag?"none":"auto"}}>
          <div style={{position:"absolute",transformOrigin:"0 0",transform:`translate(${cam.x}px,${cam.y}px) scale(${cam.z})`,willChange:"transform"}}>
            {/* guides */}
            {guides.map((g,i)=>g.t==="v"?<div key={i} style={{position:"absolute",left:g.p,top:-9999,width:1,height:99999,background:p.ac,opacity:.25,pointerEvents:"none"}}/>:<div key={i} style={{position:"absolute",top:g.p,left:-9999,width:99999,height:1,background:p.ac,opacity:.25,pointerEvents:"none"}}/>)}
            {shapes.map(s=>{
              const isSel=sel===s.id,isDrg=drag===s.id;
              return(
                <div key={s.id} style={{position:"absolute",left:s.x,top:s.y,width:s.w,height:s.h,zIndex:isSel?200:1}}>
                  {/* cycle arrows */}
                  {(isSel||hov===s.id)&&maxV(s.type)>1&&(
                    <div style={{position:"absolute",top:"50%",left:-28,transform:"translateY(-50%)",display:"flex",gap:4}}>
                      <button onClick={()=>cycle(s.id,-1)} style={{width:22,height:22,borderRadius:6,background:p.card,border:`1px solid ${p.bd}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,color:p.mu}}>‹</button>
                    </div>
                  )}
                  {(isSel||hov===s.id)&&maxV(s.type)>1&&(
                    <div style={{position:"absolute",top:"50%",right:-28,transform:"translateY(-50%)"}}>
                      <button onClick={()=>cycle(s.id,1)} style={{width:22,height:22,borderRadius:6,background:p.card,border:`1px solid ${p.bd}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,color:p.mu}}>›</button>
                    </div>
                  )}
                  {/* delete */}
                  {isSel&&(
                    <button onClick={onDel}
                      style={{position:"absolute",top:-10,right:-10,width:22,height:22,borderRadius:999,background:p.mu+"88",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:201,transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#E0524D"}
                      onMouseLeave={e=>e.currentTarget.style.background=p.mu+"88"}>
                      <svg width="10" height="10" viewBox="0 0 10 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></svg>
                    </button>
                  )}
                  <div onMouseDown={e=>onDown(e,s)} 
                    onTouchStart={e=>{if(e.touches[0]){const t=e.touches[0];onDown({clientX:t.clientX,clientY:t.clientY,stopPropagation:()=>{}},s)}}}
                    onMouseEnter={()=>setHov(s.id)} onMouseLeave={()=>setHov(null)}
                    style={{width:s.w,height:s.h,cursor:isDrg?"grabbing":"grab",transition:isDrg?"none":"transform .1s",transform:isDrg?"scale(1.015)":"scale(1)",filter:isDrg?`drop-shadow(0 8px 20px ${p.ac}15)`:"none",outline:isSel?`2px solid ${p.ac}55`:"none",outlineOffset:4,borderRadius:14,touchAction:"none"}}>
                    <C type={s.type} v={s.variant||0} p={p} editable={isSel} texts={s.texts||{}} onText={(k,val)=>updateText(s.id,k,val)} font={s.font||0}/>
                    {isSel&&<div onMouseDown={e=>{e.stopPropagation();setRsz(s.id)}} style={{position:"absolute",right:-4,bottom:-4,width:8,height:8,background:p.ac,borderRadius:2,cursor:"nwse-resize",zIndex:11}}/>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* empty state */}
          {shapes.length===0&&(
            <div data-c="1" style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",padding:20,textAlign:"center"}}>
              <p style={{fontFamily:"'Instrument Serif',Georgia,serif",fontSize:isMobile?20:26,color:p.mu,opacity:.3,margin:"0 0 6px"}}>{isMobile?"Tap menu to add":"Drag components here"}</p>
              <p style={{fontSize:isMobile?11:13,color:p.mu,opacity:.2}}>{isMobile?"Open sidebar and tap components":"Material Design 3 components with variants"}</p>
            </div>
          )}

          {/* zoom indicator */}
          <div style={{position:"absolute",bottom:isMobile?16:12,right:isMobile?16:14,display:"flex",alignItems:"center",gap:isMobile?8:6,zIndex:60}}>
            <button onClick={()=>setCam(c=>{const nz=Math.max(.15,c.z-0.15);const el=cRef.current.getBoundingClientRect();const mx=el.width/2,my=el.height/2;return{x:mx-(mx-c.x)*(nz/c.z),y:my-(my-c.y)*(nz/c.z),z:nz}})} style={{width:isMobile?36:24,height:isMobile?36:24,borderRadius:isMobile?10:6,border:`1px solid ${p.bd}`,background:p.card,color:p.mu,fontSize:isMobile?18:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",padding:0}}>-</button>
            <button onClick={()=>setCam({x:0,y:0,z:1})} title="Reset zoom" style={{fontSize:isMobile?12:10,color:p.mu,background:p.card,border:`1px solid ${p.bd}`,borderRadius:isMobile?10:6,padding:isMobile?"6px 12px":"3px 8px",cursor:"pointer",fontFamily:"inherit",minWidth:isMobile?52:42,textAlign:"center"}}>{zoomPct}%</button>
            <button onClick={()=>setCam(c=>{const nz=Math.min(4,c.z+0.15);const el=cRef.current.getBoundingClientRect();const mx=el.width/2,my=el.height/2;return{x:mx-(mx-c.x)*(nz/c.z),y:my-(my-c.y)*(nz/c.z),z:nz}})} style={{width:isMobile?36:24,height:isMobile?36:24,borderRadius:isMobile?10:6,border:`1px solid ${p.bd}`,background:p.card,color:p.mu,fontSize:isMobile?18:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",padding:0}}>+</button>
          </div>
        </div>
      </div>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(128,128,128,.12);border-radius:2px}`}</style>
    </div>
  );
}
