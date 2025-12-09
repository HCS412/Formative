const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-B1pTDTCA.js","assets/useSwitchChain-Ddas0mjs.js","assets/useChainId-D7YJGvzg.js","assets/index-DodDctfl.js","assets/index-9wS3N8kv.css","assets/isAddressEqual-CLzLXNo_.js","assets/secp256k1-DEMtbeZA.js","assets/waitForCallsStatus-BrCOB5r1.js","assets/sendTransaction-vTUveoQV.js","assets/index-nibyPLVP.js","assets/metamask-sdk-CYwNXe-E.js","assets/index-oLWYEbgB.js","assets/index-My90LZL7.js","assets/index-Ce3IPH2_.js","assets/native-Bz5QQgeN.js","assets/events-DQ172AOg.js","assets/index.es-CU6YW5cP.js"])))=>i.map(i=>d[i]);
import{T as fi,r as b,j as K,_ as k,U as a,V as fr}from"./index-DodDctfl.js";import{bJ as ge,ct as Fe,cs as Et,Y as Ce,U as ne,a8 as io,a0 as pi,cu as so,v as $,ag as Rt,cU as hi,V as mi}from"./useChainId-D7YJGvzg.js";import{H as ye,w as pr,_ as Be,M as hr,R as gi,Q as wi,L as Ot,W as vi,S as bi,O as Ci,b as yi,u as En,V as Ai,T as Ei,Y as xi}from"./useSwitchChain-Ddas0mjs.js";var ki=fi();function ji(e){return{formatters:void 0,fees:void 0,serializers:void 0,...e}}function mr(e){const{chain:t}=e,n=t.rpcUrls.default.http[0];if(!e.transports)return[n];const o=e.transports?.[t.id]?.({chain:t});return(o?.value?.transports||[o]).map(({value:i})=>i?.url||n)}var lo='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',_i={rounded:`SFRounded, ui-rounded, "SF Pro Rounded", ${lo}`,system:lo},Xe={large:{actionButton:"9999px",connectButton:"12px",modal:"24px",modalMobile:"28px"},medium:{actionButton:"10px",connectButton:"8px",modal:"16px",modalMobile:"18px"},none:{actionButton:"0px",connectButton:"0px",modal:"0px",modalMobile:"0px"},small:{actionButton:"4px",connectButton:"4px",modal:"8px",modalMobile:"8px"}},Bi={large:{modalOverlay:"blur(20px)"},none:{modalOverlay:"blur(0px)"},small:{modalOverlay:"blur(4px)"}},xn=({borderRadius:e="large",fontStack:t="rounded",overlayBlur:n="none"})=>({blurs:{modalOverlay:Bi[n].modalOverlay},fonts:{body:_i[t]},radii:{actionButton:Xe[e].actionButton,connectButton:Xe[e].connectButton,menuButton:Xe[e].connectButton,modal:Xe[e].modal,modalMobile:Xe[e].modalMobile}}),vt="#1A1B1F",gr={blue:{accentColor:"#3898FF",accentColorForeground:"#FFF"},green:{accentColor:"#4BD166",accentColorForeground:vt},orange:{accentColor:"#FF983D",accentColorForeground:vt},pink:{accentColor:"#FF7AB8",accentColorForeground:vt},purple:{accentColor:"#7A70FF",accentColorForeground:"#FFF"},red:{accentColor:"#FF6257",accentColorForeground:"#FFF"}},co=gr.blue,wr=({accentColor:e=co.accentColor,accentColorForeground:t=co.accentColorForeground,...n}={})=>({...xn(n),colors:{accentColor:e,accentColorForeground:t,actionButtonBorder:"rgba(255, 255, 255, 0.04)",actionButtonBorderMobile:"rgba(255, 255, 255, 0.08)",actionButtonSecondaryBackground:"rgba(255, 255, 255, 0.08)",closeButton:"rgba(224, 232, 255, 0.6)",closeButtonBackground:"rgba(255, 255, 255, 0.08)",connectButtonBackground:vt,connectButtonBackgroundError:"#FF494A",connectButtonInnerBackground:"linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))",connectButtonText:"#FFF",connectButtonTextError:"#FFF",connectionIndicator:"#30E000",downloadBottomCardBackground:"linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",downloadTopCardBackground:"linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F",error:"#FF494A",generalBorder:"rgba(255, 255, 255, 0.08)",generalBorderDim:"rgba(255, 255, 255, 0.04)",menuItemBackground:"rgba(224, 232, 255, 0.1)",modalBackdrop:"rgba(0, 0, 0, 0.5)",modalBackground:"#1A1B1F",modalBorder:"rgba(255, 255, 255, 0.08)",modalText:"#FFF",modalTextDim:"rgba(224, 232, 255, 0.3)",modalTextSecondary:"rgba(255, 255, 255, 0.6)",profileAction:"rgba(224, 232, 255, 0.1)",profileActionHover:"rgba(224, 232, 255, 0.2)",profileForeground:"rgba(224, 232, 255, 0.05)",selectedOptionBorder:"rgba(224, 232, 255, 0.1)",standby:"#FFD641"},shadows:{connectButton:"0px 4px 12px rgba(0, 0, 0, 0.1)",dialog:"0px 8px 32px rgba(0, 0, 0, 0.32)",profileDetailsAction:"0px 2px 6px rgba(37, 41, 46, 0.04)",selectedOption:"0px 2px 6px rgba(0, 0, 0, 0.24)",selectedWallet:"0px 2px 6px rgba(0, 0, 0, 0.24)",walletLogo:"0px 2px 16px rgba(0, 0, 0, 0.16)"}});wr.accentColors=gr;var vr={blue:{accentColor:"#3898FF",accentColorForeground:"#FFF"},green:{accentColor:"#4BD166",accentColorForeground:"#000"},orange:{accentColor:"#FF983D",accentColorForeground:"#000"},pink:{accentColor:"#FF7AB8",accentColorForeground:"#000"},purple:{accentColor:"#7A70FF",accentColorForeground:"#FFF"},red:{accentColor:"#FF6257",accentColorForeground:"#FFF"}},uo=vr.blue,br=({accentColor:e=uo.accentColor,accentColorForeground:t=uo.accentColorForeground,...n}={})=>({...xn(n),colors:{accentColor:e,accentColorForeground:t,actionButtonBorder:"rgba(255, 255, 255, 0.04)",actionButtonBorderMobile:"rgba(255, 255, 255, 0.1)",actionButtonSecondaryBackground:"rgba(255, 255, 255, 0.08)",closeButton:"rgba(255, 255, 255, 0.7)",closeButtonBackground:"rgba(255, 255, 255, 0.08)",connectButtonBackground:"#000",connectButtonBackgroundError:"#FF494A",connectButtonInnerBackground:"linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12))",connectButtonText:"#FFF",connectButtonTextError:"#FFF",connectionIndicator:"#30E000",downloadBottomCardBackground:"linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.1) 71.04%), #050505",downloadTopCardBackground:"linear-gradient(126deg, rgba(120, 120, 120, 0.1) 9.49%, rgba(0, 0, 0, 0) 71.04%), #050505",error:"#FF494A",generalBorder:"rgba(255, 255, 255, 0.08)",generalBorderDim:"rgba(255, 255, 255, 0.04)",menuItemBackground:"rgba(255, 255, 255, 0.08)",modalBackdrop:"rgba(0, 0, 0, 0.7)",modalBackground:"#000",modalBorder:"rgba(255, 255, 255, 0.08)",modalText:"#FFF",modalTextDim:"rgba(255, 255, 255, 0.2)",modalTextSecondary:"rgba(255, 255, 255, 0.6)",profileAction:"rgba(255, 255, 255, 0.1)",profileActionHover:"rgba(255, 255, 255, 0.2)",profileForeground:"rgba(255, 255, 255, 0.06)",selectedOptionBorder:"rgba(224, 232, 255, 0.1)",standby:"#FFD641"},shadows:{connectButton:"0px 4px 12px rgba(0, 0, 0, 0.1)",dialog:"0px 8px 32px rgba(0, 0, 0, 0.32)",profileDetailsAction:"0px 2px 6px rgba(37, 41, 46, 0.04)",selectedOption:"0px 2px 6px rgba(0, 0, 0, 0.24)",selectedWallet:"0px 2px 6px rgba(0, 0, 0, 0.24)",walletLogo:"0px 2px 16px rgba(0, 0, 0, 0.16)"}});br.accentColors=vr;var Cr={blue:{accentColor:"#0E76FD",accentColorForeground:"#FFF"},green:{accentColor:"#1DB847",accentColorForeground:"#FFF"},orange:{accentColor:"#FF801F",accentColorForeground:"#FFF"},pink:{accentColor:"#FF5CA0",accentColorForeground:"#FFF"},purple:{accentColor:"#5F5AFA",accentColorForeground:"#FFF"},red:{accentColor:"#FA423C",accentColorForeground:"#FFF"}},fo=Cr.blue,kn=({accentColor:e=fo.accentColor,accentColorForeground:t=fo.accentColorForeground,...n}={})=>({...xn(n),colors:{accentColor:e,accentColorForeground:t,actionButtonBorder:"rgba(0, 0, 0, 0.04)",actionButtonBorderMobile:"rgba(0, 0, 0, 0.06)",actionButtonSecondaryBackground:"rgba(0, 0, 0, 0.06)",closeButton:"rgba(60, 66, 66, 0.8)",closeButtonBackground:"rgba(0, 0, 0, 0.06)",connectButtonBackground:"#FFF",connectButtonBackgroundError:"#FF494A",connectButtonInnerBackground:"linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",connectButtonText:"#25292E",connectButtonTextError:"#FFF",connectionIndicator:"#30E000",downloadBottomCardBackground:"linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF",downloadTopCardBackground:"linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF",error:"#FF494A",generalBorder:"rgba(0, 0, 0, 0.06)",generalBorderDim:"rgba(0, 0, 0, 0.03)",menuItemBackground:"rgba(60, 66, 66, 0.1)",modalBackdrop:"rgba(0, 0, 0, 0.3)",modalBackground:"#FFF",modalBorder:"transparent",modalText:"#25292E",modalTextDim:"rgba(60, 66, 66, 0.3)",modalTextSecondary:"rgba(60, 66, 66, 0.6)",profileAction:"#FFF",profileActionHover:"rgba(255, 255, 255, 0.5)",profileForeground:"rgba(60, 66, 66, 0.06)",selectedOptionBorder:"rgba(60, 66, 66, 0.1)",standby:"#FFD641"},shadows:{connectButton:"0px 4px 12px rgba(0, 0, 0, 0.1)",dialog:"0px 8px 32px rgba(0, 0, 0, 0.32)",profileDetailsAction:"0px 2px 6px rgba(37, 41, 46, 0.04)",selectedOption:"0px 2px 6px rgba(0, 0, 0, 0.24)",selectedWallet:"0px 2px 6px rgba(0, 0, 0, 0.12)",walletLogo:"0px 2px 16px rgba(0, 0, 0, 0.16)"}});kn.accentColors=Cr;var pn=`{
  "connect_wallet": {
    "label": "Connect Wallet",
    "wrong_network": {
      "label": "Wrong network"
    }
  },

  "intro": {
    "title": "What is a Wallet?",
    "description": "A wallet is used to send, receive, store, and display digital assets. It's also a new way to log in, without needing to create new accounts and passwords on every website.",
    "digital_asset": {
      "title": "A Home for your Digital Assets",
      "description": "Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs."
    },
    "login": {
      "title": "A New Way to Log In",
      "description": "Instead of creating new accounts and passwords on every website, just connect your wallet."
    },
    "get": {
      "label": "Get a Wallet"
    },
    "learn_more": {
      "label": "Learn More"
    }
  },

  "sign_in": {
    "label": "Verify your account",
    "description": "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
    "message": {
      "send": "Sign message",
      "preparing": "Preparing message...",
      "cancel": "Cancel",
      "preparing_error": "Error preparing message, please retry!"
    },
    "signature": {
      "waiting": "Waiting for signature...",
      "verifying": "Verifying signature...",
      "signing_error": "Error signing message, please retry!",
      "verifying_error": "Error verifying signature, please retry!",
      "oops_error": "Oops, something went wrong!"
    }
  },

  "connect": {
    "label": "Connect",
    "title": "Connect a Wallet",
    "new_to_ethereum": {
      "description": "New to Ethereum wallets?",
      "learn_more": {
        "label": "Learn More"
      }
    },
    "learn_more": {
      "label": "Learn more"
    },
    "recent": "Recent",
    "status": {
      "opening": "Opening %{wallet}...",
      "connecting": "Connecting",
      "connect_mobile": "Continue in %{wallet}",
      "not_installed": "%{wallet} is not installed",
      "not_available": "%{wallet} is not available",
      "confirm": "Confirm connection in the extension",
      "confirm_mobile": "Accept connection request in the wallet"
    },
    "secondary_action": {
      "get": {
        "description": "Don't have %{wallet}?",
        "label": "GET"
      },
      "install": {
        "label": "INSTALL"
      },
      "retry": {
        "label": "RETRY"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Need the official WalletConnect modal?",
        "compact": "Need the WalletConnect modal?"
      },
      "open": {
        "label": "OPEN"
      }
    }
  },

  "connect_scan": {
    "title": "Scan with %{wallet}",
    "fallback_title": "Scan with your phone"
  },

  "connector_group": {
    "installed": "Installed",
    "recommended": "Recommended",
    "other": "Other",
    "popular": "Popular",
    "more": "More",
    "others": "Others"
  },

  "get": {
    "title": "Get a Wallet",
    "action": {
      "label": "GET"
    },
    "mobile": {
      "description": "Mobile Wallet"
    },
    "extension": {
      "description": "Browser Extension"
    },
    "mobile_and_extension": {
      "description": "Mobile Wallet and Extension"
    },
    "mobile_and_desktop": {
      "description": "Mobile and Desktop Wallet"
    },
    "looking_for": {
      "title": "Not what you're looking for?",
      "mobile": {
        "description": "Select a wallet on the main screen to get started with a different wallet provider."
      },
      "desktop": {
        "compact_description": "Select a wallet on the main screen to get started with a different wallet provider.",
        "wide_description": "Select a wallet on the left to get started with a different wallet provider."
      }
    }
  },

  "get_options": {
    "title": "Get started with %{wallet}",
    "short_title": "Get %{wallet}",
    "mobile": {
      "title": "%{wallet} for Mobile",
      "description": "Use the mobile wallet to explore the world of Ethereum.",
      "download": {
        "label": "Get the app"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "Access your wallet right from your favorite web browser.",
      "download": {
        "label": "Add to %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "Access your wallet natively from your powerful desktop.",
      "download": {
        "label": "Add to %{platform}"
      }
    }
  },

  "get_mobile": {
    "title": "Install %{wallet}",
    "description": "Scan with your phone to download on iOS or Android",
    "continue": {
      "label": "Continue"
    }
  },

  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "extension": {
      "refresh": {
        "label": "Refresh"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    }
  },

  "chains": {
    "title": "Switch Networks",
    "wrong_network": "Wrong network detected, switch or disconnect to continue.",
    "confirm": "Confirm in Wallet",
    "switching_not_supported": "Your wallet does not support switching networks from %{appName}. Try switching networks from within your wallet instead.",
    "switching_not_supported_fallback": "Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.",
    "disconnect": "Disconnect",
    "connected": "Connected"
  },

  "profile": {
    "disconnect": {
      "label": "Disconnect"
    },
    "copy_address": {
      "label": "Copy Address",
      "copied": "Copied!"
    },
    "explorer": {
      "label": "View more on explorer"
    },
    "transactions": {
      "description": "%{appName} transactions will appear here...",
      "description_fallback": "Your transactions will appear here...",
      "recent": {
        "title": "Recent Transactions"
      },
      "clear": {
        "label": "Clear All"
      }
    }
  },

  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Put Argent on your home screen for faster access to your wallet.",
          "title": "Open the Argent app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "berasig": {
      "extension": {
        "step1": {
          "title": "Install the BeraSig extension",
          "description": "We recommend pinning BeraSig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "best": {
      "qr_code": {
        "step1": {
          "title": "Open the Best Wallet app",
          "description": "Add Best Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bifrost Wallet on your home screen for quicker access.",
          "title": "Open the Bifrost Wallet app"
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "bitget": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bitget Wallet on your home screen for quicker access.",
          "title": "Open the Bitget Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Bitget Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitget Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitski": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Bitski to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitski extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitverse": {
      "qr_code": {
        "step1": {
          "title": "Open the Bitverse Wallet app",
          "description": "Add Bitverse Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bloom": {
      "desktop": {
        "step1": {
          "title": "Open the Bloom Wallet app",
          "description": "We recommend putting Bloom Wallet on your home screen for quicker access."
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you have a wallet, click on Connect to connect via Bloom. A connection prompt in the app will appear for you to confirm the connection.",
          "title": "Click on Connect"
        }
      }
    },

    "bybit": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bybit on your home screen for faster access to your wallet.",
          "title": "Open the Bybit app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Bybit Wallet for easy access.",
          "title": "Install the Bybit Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Bybit Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "binance": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Binance on your home screen for faster access to your wallet.",
          "title": "Open the Binance app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Binance Wallet extension",
          "description": "We recommend pinning Binance Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "coin98": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coin98 Wallet on your home screen for faster access to your wallet.",
          "title": "Open the Coin98 Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Coin98 Wallet for easy access.",
          "title": "Install the Coin98 Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Coin98 Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coinbase Wallet on your home screen for quicker access.",
          "title": "Open the Coinbase Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Coinbase Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Coinbase Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "compass": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Compass Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Compass Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "core": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Core on your home screen for faster access to your wallet.",
          "title": "Open the Core app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Core to your taskbar for quicker access to your wallet.",
          "title": "Install the Core extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "fox": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting FoxWallet on your home screen for quicker access.",
          "title": "Open the FoxWallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "frontier": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Frontier Wallet on your home screen for quicker access.",
          "title": "Open the Frontier Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Frontier Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Open the imToken app",
          "description": "Put imToken app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "iopay": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting ioPay on your home screen for faster access to your wallet.",
          "title": "Open the ioPay app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      }
    },

    "kaikas": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaikas to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaikas extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaikas app",
          "description": "Put Kaikas app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kaia": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaia to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaia extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaia app",
          "description": "Put Kaia app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kraken": {
      "qr_code": {
        "step1": {
          "title": "Open the Kraken Wallet app",
          "description": "Add Kraken Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "kresus": {
      "qr_code": {
        "step1": {
          "title": "Open the Kresus Wallet app",
          "description": "Add Kresus Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "magicEden": {
      "extension": {
        "step1": {
          "title": "Install the Magic Eden extension",
          "description": "We recommend pinning Magic Eden to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Open the MetaMask app",
          "description": "We recommend putting MetaMask on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the MetaMask extension",
          "description": "We recommend pinning MetaMask to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "nestwallet": {
      "extension": {
        "step1": {
          "title": "Install the NestWallet extension",
          "description": "We recommend pinning NestWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "okx": {
      "qr_code": {
        "step1": {
          "title": "Open the OKX Wallet app",
          "description": "We recommend putting OKX Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the OKX Wallet extension",
          "description": "We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "omni": {
      "qr_code": {
        "step1": {
          "title": "Open the Omni app",
          "description": "Add Omni to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your home screen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "1inch": {
      "qr_code": {
        "step1": {
          "description": "Put 1inch Wallet on your home screen for faster access to your wallet.",
          "title": "Open the 1inch Wallet app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Open the TokenPocket app",
          "description": "We recommend putting TokenPocket on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the TokenPocket extension",
          "description": "We recommend pinning TokenPocket to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "trust": {
      "qr_code": {
        "step1": {
          "title": "Open the Trust Wallet app",
          "description": "Put Trust Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Trust Wallet extension",
          "description": "Click at the top right of your browser and pin Trust Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up Trust Wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Open the Uniswap app",
          "description": "Add Uniswap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Open the Zerion app",
          "description": "We recommend putting Zerion on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Zerion extension",
          "description": "We recommend pinning Zerion to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Open the Rainbow app",
          "description": "We recommend putting Rainbow on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "You can easily backup your wallet using our backup feature on your phone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "enkrypt": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Enkrypt Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Enkrypt Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "frame": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Frame to your taskbar for quicker access to your wallet.",
          "title": "Install Frame & the companion extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "one_key": {
      "extension": {
        "step1": {
          "title": "Install the OneKey Wallet extension",
          "description": "We recommend pinning OneKey Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "paraswap": {
      "qr_code": {
        "step1": {
          "title": "Open the ParaSwap app",
          "description": "Add ParaSwap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "phantom": {
      "extension": {
        "step1": {
          "title": "Install the Phantom extension",
          "description": "We recommend pinning Phantom to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rabby": {
      "extension": {
        "step1": {
          "title": "Install the Rabby extension",
          "description": "We recommend pinning Rabby to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ronin": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Ronin Wallet on your home screen for quicker access.",
          "title": "Open the Ronin Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Ronin Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Ronin Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "ramper": {
      "extension": {
        "step1": {
          "title": "Install the Ramper extension",
          "description": "We recommend pinning Ramper to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safeheron": {
      "extension": {
        "step1": {
          "title": "Install the Core extension",
          "description": "We recommend pinning Safeheron to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "taho": {
      "extension": {
        "step1": {
          "title": "Install the Taho extension",
          "description": "We recommend pinning Taho to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "wigwam": {
      "extension": {
        "step1": {
          "title": "Install the Wigwam extension",
          "description": "We recommend pinning Wigwam to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "talisman": {
      "extension": {
        "step1": {
          "title": "Install the Talisman extension",
          "description": "We recommend pinning Talisman to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import an Ethereum Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "xdefi": {
      "extension": {
        "step1": {
          "title": "Install the XDEFI Wallet extension",
          "description": "We recommend pinning XDEFI Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "zeal": {
      "qr_code": {
        "step1": {
          "title": "Open the Zeal app",
          "description": "Add Zeal Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Zeal extension",
          "description": "We recommend pinning Zeal to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safepal": {
      "extension": {
        "step1": {
          "title": "Install the SafePal Wallet extension",
          "description": "Click at the top right of your browser and pin SafePal Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up SafePal Wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SafePal Wallet app",
          "description": "Put SafePal Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "desig": {
      "extension": {
        "step1": {
          "title": "Install the Desig extension",
          "description": "We recommend pinning Desig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "subwallet": {
      "extension": {
        "step1": {
          "title": "Install the SubWallet extension",
          "description": "We recommend pinning SubWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SubWallet app",
          "description": "We recommend putting SubWallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "clv": {
      "extension": {
        "step1": {
          "title": "Install the CLV Wallet extension",
          "description": "We recommend pinning CLV Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the CLV Wallet app",
          "description": "We recommend putting CLV Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "okto": {
      "qr_code": {
        "step1": {
          "title": "Open the Okto app",
          "description": "Add Okto to your home screen for quick access"
        },
        "step2": {
          "title": "Create an MPC Wallet",
          "description": "Create an account and generate a wallet"
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Tap the Scan QR icon at the top right and confirm the prompt to connect."
        }
      }
    },

    "ledger": {
      "desktop": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "Set up a new Ledger or connect to an existing one."
        },
        "step3": {
          "title": "Connect",
          "description": "A connection prompt will appear for you to connect your wallet."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "You can either sync with the desktop app or connect your Ledger."
        },
        "step3": {
          "title": "Scan the code",
          "description": "Tap WalletConnect then Switch to Scanner. After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "valora": {
      "qr_code": {
        "step1": {
          "title": "Open the Valora app",
          "description": "We recommend putting Valora on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "gate": {
      "qr_code": {
        "step1": {
          "title": "Open the Gate app",
          "description": "We recommend putting Gate on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Gate extension",
          "description": "We recommend pinning Gate to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "gemini": {
      "qr_code": {
        "step1": {
          "title": "Open keys.gemini.com",
          "description": "Visit keys.gemini.com on your mobile browser - no app download required."
        },
        "step2": {
          "title": "Create Your Wallet Instantly",
          "description": "Set up your smart wallet in seconds using your device's built-in authentication."
        },
        "step3": {
          "title": "Scan to Connect",
          "description": "Scan the QR code to instantly connect your wallet - it just works."
        }
      },
      "extension": {
        "step1": {
          "title": "Go to keys.gemini.com",
          "description": "No extensions or downloads needed - your wallet lives securely in the browser."
        },
        "step2": {
          "title": "One-Click Setup",
          "description": "Create your smart wallet instantly with passkey authentication - easier than any wallet out there."
        },
        "step3": {
          "title": "Connect and Go",
          "description": "Approve the connection and you're ready - the unopinionated wallet that just works."
        }
      }
    },

    "xportal": {
      "qr_code": {
        "step1": {
          "description": "Put xPortal on your home screen for faster access to your wallet.",
          "title": "Open the xPortal app"
        },
        "step2": {
          "description": "Create a wallet or import an existing one.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "mew": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting MEW Wallet on your home screen for quicker access.",
          "title": "Open the MEW Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "zilpay": {
      "qr_code": {
        "step1": {
          "title": "Open the ZilPay app",
          "description": "Add ZilPay to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "nova": {
      "qr_code": {
        "step1": {
          "title": "Open the Nova Wallet app",
          "description": "Add Nova Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    }
  }
}
`;function Ii(e,t){return Object.defineProperty(e,"__recipe__",{value:t,writable:!1}),e}var yr=Ii;function Ar(e){var{conditions:t}=e;if(!t)throw new Error("Styles have no conditions");function n(o){if(typeof o=="string"||typeof o=="number"||typeof o=="boolean"){if(!t.defaultCondition)throw new Error("No default condition");return{[t.defaultCondition]:o}}if(Array.isArray(o)){if(!("responsiveArray"in t))throw new Error("Responsive arrays are not supported");var r={};for(var i in t.responsiveArray)o[i]!=null&&(r[t.responsiveArray[i]]=o[i]);return r}return o}return yr(n,{importPath:"@vanilla-extract/sprinkles/createUtils",importName:"createNormalizeValueFn",args:[{conditions:e.conditions}]})}function Si(e){var{conditions:t}=e;if(!t)throw new Error("Styles have no conditions");var n=Ar(e);function o(r,i){if(typeof r=="string"||typeof r=="number"||typeof r=="boolean"){if(!t.defaultCondition)throw new Error("No default condition");return i(r,t.defaultCondition)}var s=Array.isArray(r)?n(r):r,c={};for(var m in s)s[m]!=null&&(c[m]=i(s[m],m));return c}return yr(o,{importPath:"@vanilla-extract/sprinkles/createUtils",importName:"createMapValueFn",args:[{conditions:e.conditions}]})}function Ti(e,t){if(typeof e!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var o=n.call(e,t);if(typeof o!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Di(e){var t=Ti(e,"string");return typeof t=="symbol"?t:String(t)}function Mi(e,t,n){return t=Di(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function po(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),n.push.apply(n,o)}return n}function Gt(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?po(Object(n),!0).forEach(function(o){Mi(e,o,n[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):po(Object(n)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(n,o))})}return e}var Ri=e=>function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];var r=Object.assign({},...n.map(m=>m.styles)),i=Object.keys(r),s=i.filter(m=>"mappings"in r[m]),c=m=>{var g=[],d={},h=Gt({},m),l=!1;for(var f of s){var u=m[f];if(u!=null){var p=r[f];l=!0;for(var v of p.mappings)d[v]=u,h[v]==null&&delete h[v]}}var y=l?Gt(Gt({},d),h):m,A=function(){var x=y[E],j=r[E];try{if(j.mappings)return 1;if(typeof x=="string"||typeof x=="number")g.push(j.values[x].defaultClass);else if(Array.isArray(x))for(var I=0;I<x.length;I++){var D=x[I];if(D!=null){var L=j.responsiveArray[I];g.push(j.values[D].conditions[L])}}else for(var P in x){var Z=x[P];Z!=null&&g.push(j.values[Z].conditions[P])}}catch(G){throw G}};for(var E in y)A();return e(g.join(" "))};return Object.assign(c,{properties:new Set(i)})},Oi=e=>e,Li=function(){return Ri(Oi)(...arguments)},Fi="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";const ho=new Map([[8217,"apostrophe"],[8260,"fraction slash"],[12539,"middle dot"]]),mo=4;function Ni(e){let t=0;function n(){return e[t++]<<8|e[t++]}let o=n(),r=1,i=[0,1];for(let x=1;x<o;x++)i.push(r+=n());let s=n(),c=t;t+=s;let m=0,g=0;function d(){return m==0&&(g=g<<8|e[t++],m=8),g>>--m&1}const h=31,l=2**h,f=l>>>1,u=f>>1,p=l-1;let v=0;for(let x=0;x<h;x++)v=v<<1|d();let y=[],A=0,E=l;for(;;){let x=Math.floor(((v-A+1)*r-1)/E),j=0,I=o;for(;I-j>1;){let P=j+I>>>1;x<i[P]?I=P:j=P}if(j==0)break;y.push(j);let D=A+Math.floor(E*i[j]/r),L=A+Math.floor(E*i[j+1]/r)-1;for(;((D^L)&f)==0;)v=v<<1&p|d(),D=D<<1&p,L=L<<1&p|1;for(;D&~L&u;)v=v&f|v<<1&p>>>1|d(),D=D<<1^f,L=(L^f)<<1|f|1;A=D,E=1+L-D}let C=o-4;return y.map(x=>{switch(x-C){case 3:return C+65792+(e[c++]<<16|e[c++]<<8|e[c++]);case 2:return C+256+(e[c++]<<8|e[c++]);case 1:return C+e[c++];default:return x-1}})}function Wi(e){let t=0;return()=>e[t++]}function Er(e){return Wi(Ni(Pi(e)))}function Pi(e){let t=[];[..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"].forEach((r,i)=>t[r.charCodeAt(0)]=i);let n=e.length,o=new Uint8Array(6*n>>3);for(let r=0,i=0,s=0,c=0;r<n;r++)c=c<<6|t[e.charCodeAt(r)],s+=6,s>=8&&(o[i++]=c>>(s-=8));return o}function Ui(e){return e&1?~e>>1:e>>1}function Qi(e,t){let n=Array(e);for(let o=0,r=0;o<e;o++)n[o]=r+=Ui(t());return n}function ot(e,t=0){let n=[];for(;;){let o=e(),r=e();if(!r)break;t+=o;for(let i=0;i<r;i++)n.push(t+i);t+=r+1}return n}function xr(e){return rt(()=>{let t=ot(e);if(t.length)return t})}function kr(e){let t=[];for(;;){let n=e();if(n==0)break;t.push(qi(n,e))}for(;;){let n=e()-1;if(n<0)break;t.push(Vi(n,e))}return t.flat()}function rt(e){let t=[];for(;;){let n=e(t.length);if(!n)break;t.push(n)}return t}function jr(e,t,n){let o=Array(e).fill().map(()=>[]);for(let r=0;r<t;r++)Qi(e,n).forEach((i,s)=>o[s].push(i));return o}function qi(e,t){let n=1+t(),o=t(),r=rt(t);return jr(r.length,1+e,t).flatMap((s,c)=>{let[m,...g]=s;return Array(r[c]).fill().map((d,h)=>{let l=h*o;return[m+h*n,g.map(f=>f+l)]})})}function Vi(e,t){let n=1+t();return jr(n,1+e,t).map(r=>[r[0],r.slice(1)])}function zi(e){let t=[],n=ot(e);return r(o([]),[]),t;function o(i){let s=e(),c=rt(()=>{let m=ot(e).map(g=>n[g]);if(m.length)return o(m)});return{S:s,B:c,Q:i}}function r({S:i,B:s},c,m){if(!(i&4&&m===c[c.length-1])){i&2&&(m=c[c.length-1]),i&1&&t.push(c);for(let g of s)for(let d of g.Q)r(g,[...c,d],m)}}}function Hi(e){return e.toString(16).toUpperCase().padStart(2,"0")}function _r(e){return`{${Hi(e)}}`}function Ki(e){let t=[];for(let n=0,o=e.length;n<o;){let r=e.codePointAt(n);n+=r<65536?1:2,t.push(r)}return t}function Pe(e){let n=e.length;if(n<4096)return String.fromCodePoint(...e);let o=[];for(let r=0;r<n;)o.push(String.fromCodePoint(...e.slice(r,r+=4096)));return o.join("")}function Gi(e,t){let n=e.length,o=n-t.length;for(let r=0;o==0&&r<n;r++)o=e[r]-t[r];return o}var Ji="AEUDWAHSCGYATwDVADIAdgAiADQAFAAtABQAIQAPACcADQASAAsAGQAJABIACQARAAUACwAFAAwABQAQAAMABwAEAAoABQAJAAIACgABAAQAFAALAAIACwABAAIAAQAHAAMAAwAEAAsADAAMAAwACwANAA0AAwAKAAkABAAdAAYAZwDTAecDNACxCmIB8xhZAqfoC190UGcThgBurwf7PT09Pb09AjgJum8OjDllxHYUKXAPxzq6tABAxgK8ysUvWAgMPT09PT09PSs6LT2HcgWXWwFLoSMEEEl5RFVMKvO0XQ8ExDdJMnIgPi89uj00MsvBXxEPAGPCDwBnQKoEbwRwBHEEcgRzBHQEdQR2BHcEeAR6BHsEfAR+BIAEgfndBQoBYgULAWIFDAFiBNcE2ATZBRAFEQUvBdALFAsVDPcNBw13DYcOMA4xDjMB4BllHI0B2grbAMDpHLkQ7QHVAPRNQQFnGRUEg0yEB2uaJEMAJpIBpob5AERSMAKNoAXqaQLRBMCzEiC+AZ4EWRJJFbEu7QDQLARtEbgECxDwAb/RyAk1AV4nD2cEQQKTAzsAGpobPgAahAGPCrysdy0OAKwAfFIcBAQFUmoA/PtZADkBIadVj2UMUgx5Il4ANQC9vLIBDAHUGVsQ8wCzfQIbGVcCHBZHAZ8CBAgXOhG7AqMZ4M7+1M0UAPDNAWsC+mcJDe8AAQA99zkEXLICyQozAo6lAobcP5JvjQLFzwKD9gU/OD8FEQCtEQL6bW+nAKUEvzjDHsuRyUvOFHcacUz5AqIFRSE2kzsBEQCuaQL5DQTlcgO6twSpTiUgCwIFCAUXBHQEqQV6swAVxUlmTmsCwjqsP/wKJQmXb793UgZBEBsnpRD3DDMBtQE7De1L2ATxBjsEyR99GRkPzZWcCKUt3QztJuMuoYBaI/UqgwXtS/Q83QtNUWgPWQtlCeM6Y4FOAyEBDSKLCt0NOQhtEPMKyWsN5RFFBzkD1UmaAKUHAQsRHTUVtSYQYqwLCTl3Bvsa9guPJq8TKXr8BdMaIQZNASka/wDPLueFsFoxXBxPXwYDCyUjxxSoUCANJUC3eEgaGwcVJakCkUNwSodRNh6TIfY8PQ1mLhNRfAf1PAUZTwuBPJ5Gq0UOEdI+jT1IIklMLAQ1fywvJ4sJzw+FDLl8cgFZCSEJsQxxEzERFzfFCDkHGS2XJCcVCCFGlWCaBPefA/MT0QMLBT8JQQcTA7UcLRMuFSkFDYEk1wLzNtUuswKPVoABFwXLDyUf3xBQR+AO6QibAmUDgyXrAC0VIQAXIpsIQ2MAX4/YUwUuywjHamwjdANnFOdhEXMHkQ5XB6ccMxW/HOFwyF4Lhggoo68JWwF1CZkBXwTjCAk1W4ygIEFnU4tYGJsgYUE/XfwCMQxlFZ9EvYd4AosPaxIbATUBcwc5DQECdxHtEWsQlQjrhgQ1tTP4OiUETyGDIBEKJwNPbM4LJyb5DPhpAaMSYgMMND137merYLYkF/0HGTLFQWAh8QuST80MnBrBGEJULhnkB78D8xrzJ+pBVwX/A6MDEzpNM+4EvQtpCIsJPwBJDqMXB9cYagpxjNABMYsBt5kDV5GDAm+PBjcHCwBnC4cFeeUAHQKnCKMABQDPA1cAOQKtB50AGQCFQQE9AycvASHlAo8DkwgxywGVLwHzKQQbwwwVAPc3bkoCw7ECgGpmogXdWAKOAkk1AU0lBAVOR1EDr3HhANsASwYT30cBFatKyxrjQwHfbysAxwD7AAU1BwVBAc0B820AtwFfCzEJorO1AU3pKQCDABVrAdcCiQDdADUAf/EBUwBNBVn5BdMCT0kBETEYK1dhAbsDHwEzAQ0AeQbLjaXJBx8EbQfTAhAbFeEC7y4HtQEDIt8TzULFAr3eVaFgAmSBAmJCW02vWzcgAqH3AmiYAmYJAp+EOBsLAmY7AmYmBG4EfwN/EwN+kjkGOXcXOYI6IyMCbB0CMjY4CgJtxwJtru+KM2dFKwFnAN4A4QBKBQeYDI0A/gvCAA21AncvAnaiPwJ5S0MCeLodXNtFrkbXAnw/AnrIAn0JAnzwBVkFIEgASH1jJAKBbQKAAAKABQJ/rklYSlsVF0rMAtEBAtDMSycDiE8Dh+ZExZEyAvKhXQMDA65LzkwtJQPPTUxNrwKLPwKK2MEbBx1DZwW3Ao43Ao5cQJeBAo7ZAo5ceFG0UzUKUtRUhQKT+wKTDADpABxVHlWvVdAGLBsplYYy4XhmRTs5ApefAu+yWCGoAFklApaPApZ8nACpWaxaCYFNADsClrUClk5cRFzRApnLAplkXMpdBxkCnJs5wjqdApwWAp+bAp64igAdDzEqDwKd8QKekgC1PWE0Ye8CntMCoG4BqQKenx8Cnk6lY8hkJyUrAievAiZ+AqD7AqBMAqLdAqHEAqYvAqXOAqf/AH0Cp/JofGixAANJahxq0QKs4wKsrgKtZwKtAgJXHQJV3AKx4dcDH05slwKyvQ0CsugXbOBtY21IXwMlzQK2XDs/bpADKUUCuF4CuUcVArkqd3A2cOECvRkCu9pwlgMyEQK+iHICAzNxAr4acyJzTwLDywLDBHOCdEs1RXTgAzynAzyaAz2/AsV8AsZHAsYQiQLIaVECyEQCyU8CyS4CZJ0C3dJ4eWF4rnklS9ADGKNnAgJh9BnzlSR7C16SXrsRAs9rAs9sL0tT0vMTnwDGrQLPcwEp6gNOEn5LBQLcJwLbigLSTwNSXANTXwEBA1WMgIk/AMsW7WBFghyC04LOg40C2scC2d6EEIRJpzwDhqUALwNkDoZxWfkAVQLfZQLeuHN3AuIv7RQB8zAnAfSbAfLShwLr8wLpcHkC6vkC6uQA+UcBuQLuiQLrnJaqlwMC7j8DheCYeXDgcaEC8wMAaQOOFpmTAvcTA5FuA5KHAveYAvnZAvhmmhyaq7s3mx4DnYMC/voBGwA5nxyfswMFjQOmagOm2QDRxQMGaqGIogUJAwxJAtQAPwMA4UEXUwER8wNrB5dnBQCTLSu3r73bAYmZFH8RBDkB+ykFIQ6dCZ8Akv0TtRQrxQL3LScApQC3BbmOkRc/xqdtQS4UJo0uAUMBgPwBtSYAdQMOBG0ALAIWDKEAAAoCPQJqA90DfgSRASBFBSF8CgAFAEQAEwA2EgJ3AQAF1QNr7wrFAgD3Cp8nv7G35QGRIUFCAekUfxE0wIkABAAbAFoCRQKEiwAGOlM6lI1tALg6jzrQAI04wTrcAKUA6ADLATqBOjs5/Dn5O3aJOls7nok6bzkYAVYBMwFsBS81XTWeNa01ZjV1NbY1xTWCNZE10jXhNZ41rTXuNf01sjXBNgI2ETXGNdU2FjYnNd417TYuNj02LjUtITY6Nj02PDbJNwgEkDxXNjg23TcgNw82yiA3iTcwCgSwPGc2JDcZN2w6jTchQtRDB0LgQwscDw8JmyhtKFFVBgDpfwDpsAD+mxQ91wLpNSMArQC9BbeOkRdLxptzBL8MDAMMAQgDAAkKCwsLCQoGBAVVBI/DvwDz9b29kaUCb0QtsRTNLt4eGBcSHAMZFhYZEhYEARAEBUEcQRxBHEEcQRxBHEEaQRxBHEFCSTxBPElISUhBNkM2QTYbNklISVmBVIgELgEaJZkC7aMAoQCjBcGOmxdNxrsBvwGJAaQcEZ0ePCklMAAhMvAIMAL54gC7Bm8EescjzQMpARQpKgDUHqSvAj5Gqwr7YrMUACT9AN3rpF27H7fsd/twPt4l+UW1yQYKBt2Cgy7qJpGiLcdE2P1cQSImUbqJ6ICH27H4knQMIRMrFkHu3sx6tC35Y+eLIh4e4CMKJ4DfyV+8mfta499RCAJ0xfeZR8PsoYOApva9pjGn4PhvyZS7/h5JLuhaucfjuU+Z584wwqNO4hWYmaBCcjgQPale1bjoHzMUbut/zTgxHxBnAyrdKpF4IRMASLBtD/jviyLeCgj8twWjAd3HchN/uqaeRYeHJgl7JEY9/cTrvtfybx/r3Y/NtxJ9dp+MTVmiS9bwBH73s8Di56/Ma+mTPMHq4T1yEG1fWcqr0u+hrGnJEvU1JJAm/maQSrKrazIyvSkDFkj8UUlfBq8baniTGPng6YZRL661rDNw4w/1g2figG0IhXnL7wosd/sVNo5dYSmMBTP5c7rYLjRdCwg8quwljOMPf63D8ICAL0r71XRiyFHdgwHbwfgnPOf4Lzjf2v+j+IiDHG2isp5yUnzSDyDRb4i/Vs0qHSHq8PiEQ/JnBP7PxnjN0j6gT4AVAeRx/1o9VnEUlUwvFrzJqHk9jxAw4sYxCnrxaeBdCFFKbnE7z+x54F5W7ZZsU6kx8Qocul6FoAHHy01FGL/nne61mn4+uYXfQ1Uccn+HMLKE+cZzT8BB1E3FRskOgJrRsq25rauLm8+uamXpkS/bTy6y1wDbCrW4eD532kTWrtNUmVVZOIn/C+/JR9KVR5iG9TY8iaT67ubm/whL1xbKZoqtY+a6fNxMJrg211bGYJDUkYMNWA0BMB++9zOm6Eik4roqs9CCEFW0lyAK0PbvlzvoxrZuY/OEhNW/l/63U15Od/RSvmDvXpGLiVmeGi5PDSH2bYz5o2g6wFDQ2FbZgYgTF8rPlvA1ifjZD3NLtFdXdpSIJvgKR7GpjJWG7GZGawPomIH8B5tUmtHH9LpM+/KQKunEPa1GiQkCXv4Cnm9DLORo2joicHdPDZ64obQrPZ5bgqckkj0G6/NEiPYBY4bCkL7W8G5YzsUb6GakFjykSPkT7JGeLeB6uJOGMm+x7N381BCDfbJFx0dtLgV9Q477BfL1fvitX5anV/oYfxeYl+eF5x5bB8+Ep/L2nsmd56aKF4aAD4GbJWsdKyBW22xEmAD3XdbtsMyAFoR5mOla0gEd9U/YVB7zvHGpHbQonay9Sv0bQ8iZ8piaXVrKc5AG1AmqqgaEvzHSP2Wux7aZTWh6quVDVU01JtMIVRdCFwlSbbqqhoFlyzsotQzRexFvZ/MqUSFu3OhRIuNBbufvBpdVgb8XdGJ48/lJPCZ7dsOujTTbKPSEvGXkOnG2Xdi8/nM3EMRqITd5QeU7iOjKqC7URJY6TnLsHij22xAHKnVRD5MDtBYnoGFqZGMDmXCW6Oj+BAWw14hESY/xLF6bLku06AHkiXTHPCFZ0f9YSqqo27eAhhS67OrA2Het4M9JM3jm/yRX6bYxnfmzYl5qQdHxN08FsNuWDrWd4vMUY2QD3hr8vS73SCTkFoXZR3xNzOQt8d/6HfjBmXqvrE6EGkLzK6YK2U2/ksU/iUH+LvVIsJI+ri2AL/klo+ShdDyfs5A83i2prkMs51IKR7ZcqjZJi5X3+bd8GlyWvtddxKEoEqSgEO7A8jIgf2nH0h8FjM7oB6yte3X5mpL0i/E4Rx0CotKnILJj/vJqo4VkPQ93jRtRVfaitQPqldl5xRYPq8387Z0DcnZvOeION0Ht1+P27kFLGQIcLBX4FG3sffccNHh5cPfzp9INoRtqVtdViJfg8RjnXiIz/MNqEN6zvzX3hMzyWC7oSoXIT14ubc0abPX8Rp9GVa5NI/8iv+6ela1oTncbdimRKnrbRffDR/X4nH+bgqAuHWl7hOaeXPWVzIeRl7ga+JzD4Sx3mlj/q6Ra/E2HhDf21eEzTLNGfCZsY+/yxZzQzIAuijG65ii4O/waAJCrEJaWd/DRAKMQ5678Dw5AT7RCKzdadIwd8LsD+DgPBASmWsUlf8R0k1w/2k4lO2Wpb4zMI6EJVJs0xk/wn8/fRUPqrDKhbjHR41SqgFMx5RGMPuduFwlu5lK89tW11sTqiX/5EfGs5nO+y9FKvgXKPOEmgE05EKNL6Sjb3xS40H3BVPhm0ESOZgAjZoymc8be0inDVo4JdJVf+NKd3tN/CaB7GShhH27qf95NoFZVX/6ZkR2lX+CgWrQ2INgkh+bbMz68+uJ3Clsh8HSMPEQtAt+BBE6fXDab7KIlsKxU1lIXW/KWVstpdPanJ0pdXpQinDyUQjtY7ZVcfiecRxRDMAUhHFU2cEaciQ+htiPMPx1kdvtWG9T44w3r037ljHBFJdYR0r55qvMRixtAEFJAqA4T1ES87FAx7UozXasytg8MftZYt0rjYgLe6EJ5aWvy2qscBSBQ7yehoJIA3wIIZ9ukfkyBb6qnue5ko8W50rpV4kXqWjI5nbGRXrNW0tBZHXlY48nSgcUXBHWT4GcgLZJoLlKJnV96kCYpq9eWHh7xJzkCAyrQuQ5AJ0qq/uZ3toJglNterev+Qm0KXxPg/+YbFRJdfhbp1wOnVOEYdVHTya6CtO0afhEaBhx3oHwCb5Kq6RwHDzFMl2vfjL8GwzcCoTj7wZe+UFnYDV2yKpPU9dba29gYBdNqJg/KXozO+CJTlKmlKhnqTf5doeS35DZFV+cYJQVjd+oVY/Gtc/6XPzUxb1gMqf6cEjNNoRC8AObrp+fx0cVtGu4ffC2TgXRC8zPl8moUHCB5HZ25d87mlsiiK0aNwBtcEQjRNBT/QrXbw/8aVXdKMHn9EqYEKEyxSGTpYQOaes1G1Qq8pDgqkZtlO2HRyCXpmeM7TSrRPkAh004BfisVpF6zP44n2Jvxz/gOVocNCyy9V6lkod28QM4pbaMvVJigD/w3BrsjSJrXlqc4ulBYOCceiBN4b/gHajYyupbhEt63a619Ay4wsL6a6w6B+A7TnoyE7BliWHJfzVxxIKM/W3M/J8Bx99Op863Q8eNuIMGRx++VbYfjm+VGYBA3Ap/KEu/wxBNBpJJncwHPG45V8Gh98ZIrGCc20MwijGowZbcS7d1nEgcOW5cddZpHL2XPAIRbColiheZzXTvBxZOY3iMSDSKDrICyJ/iQs1vdplVdH/JrLJsQ2jtTnfCrITIghq3KFX3qAgLWAIp8IffNSdTYptnbGfc8s+qcr3zyzyHp1aJg+jxTF4kD1ry5Wauv5V3xnOGwTFecNzXSLHBW20/pCQjk4uorD0plIhMSTc79+/r4RKPClRYTBYex1Ob5crtfvRQBBv6re/6FhtCqtduag67glqRA77/3ulblh9YRtMdDxkCyJDeNnAuCLPQFmdRRWJtH20Z8DstfJf+5oj5SSB64d0iF5/Ya4KfTWxfivj9Ap2/zbYaTo/1gO3tM6RYsCZharMBFr7Fm61mLSrQnEI4OF1gbVS4k/JE9UotOrnLJZuswoWodCSV8zbybkJSVIP7n8UaE9xCR39rJZmf27HOAPVOGc9pdkQUcRrI0qyVF9Z3j1RHDbxIfwbWzmPVjwIdPJvtmBYwEQIUsIW1S939hcVikK00ozPRI02cqhzVUNzpOxVdrwRPvlh1aIOf0xFEqD3YkGnCnFah/cFN3J2gB7N+bZSGawwkKFu1tpQMrp1W+27YNkyT0TpcFpTqgOqqLabrgcCUPxh97mREOGy4xItzQ9xSl6rq+8BZsHcrQFReS+QeMxJ3P6CnL9EP/eOLDjumLhvrcQrpPiknsofbzBv9gTP0lU+TIVwE6E7CcKfT36q+ZiEOHJ9ayf0dyUJLezAb2M8aNHwd0+OJmsVgTzRWA";const at=44032,xt=4352,kt=4449,jt=4519,Br=19,Ir=21,Ue=28,_t=Ir*Ue,Yi=Br*_t,Xi=at+Yi,Zi=xt+Br,$i=kt+Ir,es=jt+Ue;function $e(e){return e>>24&255}function Sr(e){return e&16777215}let hn,go,mn,bt;function ts(){let e=Er(Ji);hn=new Map(xr(e).flatMap((t,n)=>t.map(o=>[o,n+1<<24]))),go=new Set(ot(e)),mn=new Map,bt=new Map;for(let[t,n]of kr(e)){if(!go.has(t)&&n.length==2){let[o,r]=n,i=bt.get(o);i||(i=new Map,bt.set(o,i)),i.set(r,t)}mn.set(t,n.reverse())}}function Tr(e){return e>=at&&e<Xi}function ns(e,t){if(e>=xt&&e<Zi&&t>=kt&&t<$i)return at+(e-xt)*_t+(t-kt)*Ue;if(Tr(e)&&t>jt&&t<es&&(e-at)%Ue==0)return e+(t-jt);{let n=bt.get(e);return n&&(n=n.get(t),n)?n:-1}}function Dr(e){hn||ts();let t=[],n=[],o=!1;function r(i){let s=hn.get(i);s&&(o=!0,i|=s),t.push(i)}for(let i of e)for(;;){if(i<128)t.push(i);else if(Tr(i)){let s=i-at,c=s/_t|0,m=s%_t/Ue|0,g=s%Ue;r(xt+c),r(kt+m),g>0&&r(jt+g)}else{let s=mn.get(i);s?n.push(...s):r(i)}if(!n.length)break;i=n.pop()}if(o&&t.length>1){let i=$e(t[0]);for(let s=1;s<t.length;s++){let c=$e(t[s]);if(c==0||i<=c){i=c;continue}let m=s-1;for(;;){let g=t[m+1];if(t[m+1]=t[m],t[m]=g,!m||(i=$e(t[--m]),i<=c))break}i=$e(t[s])}}return t}function os(e){let t=[],n=[],o=-1,r=0;for(let i of e){let s=$e(i),c=Sr(i);if(o==-1)s==0?o=c:t.push(c);else if(r>0&&r>=s)s==0?(t.push(o,...n),n.length=0,o=c):n.push(c),r=s;else{let m=ns(o,c);m>=0?o=m:r==0&&s==0?(t.push(o),o=c):(n.push(c),r=s)}}return o>=0&&t.push(o,...n),t}function Mr(e){return Dr(e).map(Sr)}function rs(e){return os(Dr(e))}const wo=45,Rr=".",Or=65039,Lr=1,Bt=e=>Array.from(e);function it(e,t){return e.P.has(t)||e.Q.has(t)}class as extends Array{get is_emoji(){return!0}}let gn,Fr,Ie,wn,Nr,Ne,Jt,Le,_e,vo,vn;function jn(){if(gn)return;let e=Er(Fi);const t=()=>ot(e),n=()=>new Set(t()),o=(d,h)=>h.forEach(l=>d.add(l));gn=new Map(kr(e)),Fr=n(),Ie=t(),wn=new Set(t().map(d=>Ie[d])),Ie=new Set(Ie),Nr=n(),n();let r=xr(e),i=e();const s=()=>{let d=new Set;return t().forEach(h=>o(d,r[h])),o(d,t()),d};Ne=rt(d=>{let h=rt(e).map(l=>l+96);if(h.length){let l=d>=i;h[0]-=32,h=Pe(h),l&&(h=`Restricted[${h}]`);let f=s(),u=s(),p=!e();return{N:h,P:f,Q:u,M:p,R:l}}}),Jt=n(),Le=new Map;let c=t().concat(Bt(Jt)).sort((d,h)=>d-h);c.forEach((d,h)=>{let l=e(),f=c[h]=l?c[h-l]:{V:[],M:new Map};f.V.push(d),Jt.has(d)||Le.set(d,f)});for(let{V:d,M:h}of new Set(Le.values())){let l=[];for(let u of d){let p=Ne.filter(y=>it(y,u)),v=l.find(({G:y})=>p.some(A=>y.has(A)));v||(v={G:new Set,V:[]},l.push(v)),v.V.push(u),o(v.G,p)}let f=l.flatMap(u=>Bt(u.G));for(let{G:u,V:p}of l){let v=new Set(f.filter(y=>!u.has(y)));for(let y of p)h.set(y,v)}}_e=new Set;let m=new Set;const g=d=>_e.has(d)?m.add(d):_e.add(d);for(let d of Ne){for(let h of d.P)g(h);for(let h of d.Q)g(h)}for(let d of _e)!Le.has(d)&&!m.has(d)&&Le.set(d,Lr);o(_e,Mr(_e)),vo=zi(e).map(d=>as.from(d)).sort(Gi),vn=new Map;for(let d of vo){let h=[vn];for(let l of d){let f=h.map(u=>{let p=u.get(l);return p||(p=new Map,u.set(l,p)),p});l===Or?h.push(...f):h=f}for(let l of h)l.V=d}}function _n(e){return(Wr(e)?"":`${Bn(Lt([e]))} `)+_r(e)}function Bn(e){return`"${e}"‎`}function is(e){if(e.length>=4&&e[2]==wo&&e[3]==wo)throw new Error(`invalid label extension: "${Pe(e.slice(0,4))}"`)}function ss(e){for(let n=e.lastIndexOf(95);n>0;)if(e[--n]!==95)throw new Error("underscore allowed only at start")}function ls(e){let t=e[0],n=ho.get(t);if(n)throw nt(`leading ${n}`);let o=e.length,r=-1;for(let i=1;i<o;i++){t=e[i];let s=ho.get(t);if(s){if(r==i)throw nt(`${n} + ${s}`);r=i+1,n=s}}if(r==o)throw nt(`trailing ${n}`)}function Lt(e,t=1/0,n=_r){let o=[];cs(e[0])&&o.push("◌"),e.length>t&&(t>>=1,e=[...e.slice(0,t),8230,...e.slice(-t)]);let r=0,i=e.length;for(let s=0;s<i;s++){let c=e[s];Wr(c)&&(o.push(Pe(e.slice(r,s))),o.push(n(c)),r=s+1)}return o.push(Pe(e.slice(r,i))),o.join("")}function cs(e,t){return jn(),Ie.has(e)}function Wr(e){return jn(),Nr.has(e)}function us(e){return hs(ds(e,rs,ws))}function ds(e,t,n){if(!e)return[];jn();let o=0;return e.split(Rr).map(r=>{let i=Ki(r),s={input:i,offset:o};o+=i.length+1;try{let c=s.tokens=gs(i,t,n),m=c.length,g;if(!m)throw new Error("empty label");let d=s.output=c.flat();if(ss(d),!(s.emoji=m>1||c[0].is_emoji)&&d.every(l=>l<128))is(d),g="ASCII";else{let l=c.flatMap(f=>f.is_emoji?[]:f);if(!l.length)g="Emoji";else{if(Ie.has(d[0]))throw nt("leading combining mark");for(let p=1;p<m;p++){let v=c[p];if(!v.is_emoji&&Ie.has(v[0]))throw nt(`emoji + combining mark: "${Pe(c[p-1])} + ${Lt([v[0]])}"`)}ls(d);let f=Bt(new Set(l)),[u]=ps(f);ms(u,l),fs(u,f),g=u.N}}s.type=g}catch(c){s.error=c}return s})}function fs(e,t){let n,o=[];for(let r of t){let i=Le.get(r);if(i===Lr)return;if(i){let s=i.M.get(r);if(n=n?n.filter(c=>s.has(c)):Bt(s),!n.length)return}else o.push(r)}if(n){for(let r of n)if(o.every(i=>it(r,i)))throw new Error(`whole-script confusable: ${e.N}/${r.N}`)}}function ps(e){let t=Ne;for(let n of e){let o=t.filter(r=>it(r,n));if(!o.length)throw Ne.some(r=>it(r,n))?Ur(t[0],n):Pr(n);if(t=o,o.length==1)break}return t}function hs(e){return e.map(({input:t,error:n,output:o})=>{if(n){let r=n.message;throw new Error(e.length==1?r:`Invalid label ${Bn(Lt(t,63))}: ${r}`)}return Pe(o)}).join(Rr)}function Pr(e){return new Error(`disallowed character: ${_n(e)}`)}function Ur(e,t){let n=_n(t),o=Ne.find(r=>r.P.has(t));return o&&(n=`${o.N} ${n}`),new Error(`illegal mixture: ${e.N} + ${n}`)}function nt(e){return new Error(`illegal placement: ${e}`)}function ms(e,t){for(let n of t)if(!it(e,n))throw Ur(e,n);if(e.M){let n=Mr(t);for(let o=1,r=n.length;o<r;o++)if(wn.has(n[o])){let i=o+1;for(let s;i<r&&wn.has(s=n[i]);i++)for(let c=o;c<i;c++)if(n[c]==s)throw new Error(`duplicate non-spacing marks: ${_n(s)}`);if(i-o>mo)throw new Error(`excessive non-spacing marks: ${Bn(Lt(n.slice(o-1,i)))} (${i-o}/${mo})`);o=i}}}function gs(e,t,n){let o=[],r=[];for(e=e.slice().reverse();e.length;){let i=vs(e);if(i)r.length&&(o.push(t(r)),r=[]),o.push(n(i));else{let s=e.pop();if(_e.has(s))r.push(s);else{let c=gn.get(s);if(c)r.push(...c);else if(!Fr.has(s))throw Pr(s)}}}return r.length&&o.push(t(r)),o}function ws(e){return e.filter(t=>t!=Or)}function vs(e,t){let n=vn,o,r=e.length;for(;r&&(n=n.get(e[--r]),!!n);){let{V:i}=n;i&&(o=i,e.length=r)}return o}function bs(e){return us(e)}function Cs(e){return bs(e)}const In=ji({id:1,name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},blockTime:12e3,rpcUrls:{default:{http:["https://eth.merkle.io"]}},blockExplorers:{default:{name:"Etherscan",url:"https://etherscan.io",apiUrl:"https://api.etherscan.io/api"}},contracts:{ensUniversalResolver:{address:"0xeeeeeeee14d718c2b47d9923deab1335e144eeee",blockCreated:23085558},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:14353601}}});var he=function(){return he=Object.assign||function(t){for(var n,o=1,r=arguments.length;o<r;o++){n=arguments[o];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},he.apply(this,arguments)};function Qr(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]]);return n}function ys(e,t,n){if(n||arguments.length===2)for(var o=0,r=t.length,i;o<r;o++)(i||!(o in t))&&(i||(i=Array.prototype.slice.call(t,0,o)),i[o]=t[o]);return e.concat(i||Array.prototype.slice.call(t))}var Ct="right-scroll-bar-position",yt="width-before-scroll-bar",As="with-scroll-bars-hidden",Es="--removed-body-scroll-bar-size";function Yt(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function xs(e,t){var n=b.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(o){var r=n.value;r!==o&&(n.value=o,n.callback(o,r))}}}})[0];return n.callback=t,n.facade}var ks=typeof window<"u"?b.useLayoutEffect:b.useEffect,bo=new WeakMap;function js(e,t){var n=xs(null,function(o){return e.forEach(function(r){return Yt(r,o)})});return ks(function(){var o=bo.get(n);if(o){var r=new Set(o),i=new Set(e),s=n.current;r.forEach(function(c){i.has(c)||Yt(c,null)}),i.forEach(function(c){r.has(c)||Yt(c,s)})}bo.set(n,e)},[e]),n}function _s(e){return e}function Bs(e,t){t===void 0&&(t=_s);var n=[],o=!1,r={read:function(){if(o)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(i){var s=t(i,o);return n.push(s),function(){n=n.filter(function(c){return c!==s})}},assignSyncMedium:function(i){for(o=!0;n.length;){var s=n;n=[],s.forEach(i)}n={push:function(c){return i(c)},filter:function(){return n}}},assignMedium:function(i){o=!0;var s=[];if(n.length){var c=n;n=[],c.forEach(i),s=n}var m=function(){var d=s;s=[],d.forEach(i)},g=function(){return Promise.resolve().then(m)};g(),n={push:function(d){s.push(d),g()},filter:function(d){return s=s.filter(d),n}}}};return r}function Is(e){e===void 0&&(e={});var t=Bs(null);return t.options=he({async:!0,ssr:!1},e),t}var qr=function(e){var t=e.sideCar,n=Qr(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var o=t.read();if(!o)throw new Error("Sidecar medium not found");return b.createElement(o,he({},n))};qr.isSideCarExport=!0;function Ss(e,t){return e.useMedium(t),qr}var Vr=Is(),Xt=function(){},Ft=b.forwardRef(function(e,t){var n=b.useRef(null),o=b.useState({onScrollCapture:Xt,onWheelCapture:Xt,onTouchMoveCapture:Xt}),r=o[0],i=o[1],s=e.forwardProps,c=e.children,m=e.className,g=e.removeScrollBar,d=e.enabled,h=e.shards,l=e.sideCar,f=e.noIsolation,u=e.inert,p=e.allowPinchZoom,v=e.as,y=v===void 0?"div":v,A=e.gapMode,E=Qr(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),C=l,x=js([n,t]),j=he(he({},E),r);return b.createElement(b.Fragment,null,d&&b.createElement(C,{sideCar:Vr,removeScrollBar:g,shards:h,noIsolation:f,inert:u,setCallbacks:i,allowPinchZoom:!!p,lockRef:n,gapMode:A}),s?b.cloneElement(b.Children.only(c),he(he({},j),{ref:x})):b.createElement(y,he({},j,{className:m,ref:x}),c))});Ft.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};Ft.classNames={fullWidth:yt,zeroRight:Ct};var Ts=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Ds(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=Ts();return t&&e.setAttribute("nonce",t),e}function Ms(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function Rs(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Os=function(){var e=0,t=null;return{add:function(n){e==0&&(t=Ds())&&(Ms(t,n),Rs(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},Ls=function(){var e=Os();return function(t,n){b.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},zr=function(){var e=Ls(),t=function(n){var o=n.styles,r=n.dynamic;return e(o,r),null};return t},Fs={left:0,top:0,right:0,gap:0},Zt=function(e){return parseInt(e||"",10)||0},Ns=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],o=t[e==="padding"?"paddingTop":"marginTop"],r=t[e==="padding"?"paddingRight":"marginRight"];return[Zt(n),Zt(o),Zt(r)]},Ws=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Fs;var t=Ns(e),n=document.documentElement.clientWidth,o=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,o-n+t[2]-t[0])}},Ps=zr(),We="data-scroll-locked",Us=function(e,t,n,o){var r=e.left,i=e.top,s=e.right,c=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(As,` {
   overflow: hidden `).concat(o,`;
   padding-right: `).concat(c,"px ").concat(o,`;
  }
  body[`).concat(We,`] {
    overflow: hidden `).concat(o,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(o,";"),n==="margin"&&`
    padding-left: `.concat(r,`px;
    padding-top: `).concat(i,`px;
    padding-right: `).concat(s,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(c,"px ").concat(o,`;
    `),n==="padding"&&"padding-right: ".concat(c,"px ").concat(o,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Ct,` {
    right: `).concat(c,"px ").concat(o,`;
  }
  
  .`).concat(yt,` {
    margin-right: `).concat(c,"px ").concat(o,`;
  }
  
  .`).concat(Ct," .").concat(Ct,` {
    right: 0 `).concat(o,`;
  }
  
  .`).concat(yt," .").concat(yt,` {
    margin-right: 0 `).concat(o,`;
  }
  
  body[`).concat(We,`] {
    `).concat(Es,": ").concat(c,`px;
  }
`)},Co=function(){var e=parseInt(document.body.getAttribute(We)||"0",10);return isFinite(e)?e:0},Qs=function(){b.useEffect(function(){return document.body.setAttribute(We,(Co()+1).toString()),function(){var e=Co()-1;e<=0?document.body.removeAttribute(We):document.body.setAttribute(We,e.toString())}},[])},qs=function(e){var t=e.noRelative,n=e.noImportant,o=e.gapMode,r=o===void 0?"margin":o;Qs();var i=b.useMemo(function(){return Ws(r)},[r]);return b.createElement(Ps,{styles:Us(i,!t,r,n?"":"!important")})},bn=!1;if(typeof window<"u")try{var ht=Object.defineProperty({},"passive",{get:function(){return bn=!0,!0}});window.addEventListener("test",ht,ht),window.removeEventListener("test",ht,ht)}catch{bn=!1}var Me=bn?{passive:!1}:!1,Vs=function(e){return e.tagName==="TEXTAREA"},Hr=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!Vs(e)&&n[t]==="visible")},zs=function(e){return Hr(e,"overflowY")},Hs=function(e){return Hr(e,"overflowX")},yo=function(e,t){var n=t.ownerDocument,o=t;do{typeof ShadowRoot<"u"&&o instanceof ShadowRoot&&(o=o.host);var r=Kr(e,o);if(r){var i=Gr(e,o),s=i[1],c=i[2];if(s>c)return!0}o=o.parentNode}while(o&&o!==n.body);return!1},Ks=function(e){var t=e.scrollTop,n=e.scrollHeight,o=e.clientHeight;return[t,n,o]},Gs=function(e){var t=e.scrollLeft,n=e.scrollWidth,o=e.clientWidth;return[t,n,o]},Kr=function(e,t){return e==="v"?zs(t):Hs(t)},Gr=function(e,t){return e==="v"?Ks(t):Gs(t)},Js=function(e,t){return e==="h"&&t==="rtl"?-1:1},Ys=function(e,t,n,o,r){var i=Js(e,window.getComputedStyle(t).direction),s=i*o,c=n.target,m=t.contains(c),g=!1,d=s>0,h=0,l=0;do{var f=Gr(e,c),u=f[0],p=f[1],v=f[2],y=p-v-i*u;(u||y)&&Kr(e,c)&&(h+=y,l+=u),c instanceof ShadowRoot?c=c.host:c=c.parentNode}while(!m&&c!==document.body||m&&(t.contains(c)||t===c));return(d&&Math.abs(h)<1||!d&&Math.abs(l)<1)&&(g=!0),g},mt=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Ao=function(e){return[e.deltaX,e.deltaY]},Eo=function(e){return e&&"current"in e?e.current:e},Xs=function(e,t){return e[0]===t[0]&&e[1]===t[1]},Zs=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},$s=0,Re=[];function el(e){var t=b.useRef([]),n=b.useRef([0,0]),o=b.useRef(),r=b.useState($s++)[0],i=b.useState(zr)[0],s=b.useRef(e);b.useEffect(function(){s.current=e},[e]),b.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(r));var p=ys([e.lockRef.current],(e.shards||[]).map(Eo),!0).filter(Boolean);return p.forEach(function(v){return v.classList.add("allow-interactivity-".concat(r))}),function(){document.body.classList.remove("block-interactivity-".concat(r)),p.forEach(function(v){return v.classList.remove("allow-interactivity-".concat(r))})}}},[e.inert,e.lockRef.current,e.shards]);var c=b.useCallback(function(p,v){if("touches"in p&&p.touches.length===2||p.type==="wheel"&&p.ctrlKey)return!s.current.allowPinchZoom;var y=mt(p),A=n.current,E="deltaX"in p?p.deltaX:A[0]-y[0],C="deltaY"in p?p.deltaY:A[1]-y[1],x,j=p.target,I=Math.abs(E)>Math.abs(C)?"h":"v";if("touches"in p&&I==="h"&&j.type==="range")return!1;var D=yo(I,j);if(!D)return!0;if(D?x=I:(x=I==="v"?"h":"v",D=yo(I,j)),!D)return!1;if(!o.current&&"changedTouches"in p&&(E||C)&&(o.current=x),!x)return!0;var L=o.current||x;return Ys(L,v,p,L==="h"?E:C)},[]),m=b.useCallback(function(p){var v=p;if(!(!Re.length||Re[Re.length-1]!==i)){var y="deltaY"in v?Ao(v):mt(v),A=t.current.filter(function(x){return x.name===v.type&&(x.target===v.target||v.target===x.shadowParent)&&Xs(x.delta,y)})[0];if(A&&A.should){v.cancelable&&v.preventDefault();return}if(!A){var E=(s.current.shards||[]).map(Eo).filter(Boolean).filter(function(x){return x.contains(v.target)}),C=E.length>0?c(v,E[0]):!s.current.noIsolation;C&&v.cancelable&&v.preventDefault()}}},[]),g=b.useCallback(function(p,v,y,A){var E={name:p,delta:v,target:y,should:A,shadowParent:tl(y)};t.current.push(E),setTimeout(function(){t.current=t.current.filter(function(C){return C!==E})},1)},[]),d=b.useCallback(function(p){n.current=mt(p),o.current=void 0},[]),h=b.useCallback(function(p){g(p.type,Ao(p),p.target,c(p,e.lockRef.current))},[]),l=b.useCallback(function(p){g(p.type,mt(p),p.target,c(p,e.lockRef.current))},[]);b.useEffect(function(){return Re.push(i),e.setCallbacks({onScrollCapture:h,onWheelCapture:h,onTouchMoveCapture:l}),document.addEventListener("wheel",m,Me),document.addEventListener("touchmove",m,Me),document.addEventListener("touchstart",d,Me),function(){Re=Re.filter(function(p){return p!==i}),document.removeEventListener("wheel",m,Me),document.removeEventListener("touchmove",m,Me),document.removeEventListener("touchstart",d,Me)}},[]);var f=e.removeScrollBar,u=e.inert;return b.createElement(b.Fragment,null,u?b.createElement(i,{styles:Zs(r)}):null,f?b.createElement(qs,{gapMode:e.gapMode}):null)}function tl(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const nl=Ss(Vr,el);var Jr=b.forwardRef(function(e,t){return b.createElement(Ft,he({},e,{ref:t,sideCar:nl}))});Jr.classNames=Ft.classNames;function xo(e){var t=e.match(/^var\((.*)\)$/);return t?t[1]:e}function ol(e,t){var n=e;for(var o of t){if(!(o in n))throw new Error("Path ".concat(t.join(" -> ")," does not exist in object"));n=n[o]}return n}function Yr(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:[],o={};for(var r in e){var i=e[r],s=[...n,r];typeof i=="string"||typeof i=="number"||i==null?o[r]=t(i,s):typeof i=="object"&&!Array.isArray(i)?o[r]=Yr(i,t,s):console.warn('Skipping invalid key "'.concat(s.join("."),'". Should be a string, number, null or object. Received: "').concat(Array.isArray(i)?"Array":typeof i,'"'))}return o}function ko(e,t){var n={};if(typeof t=="object"){var o=e;Yr(t,(c,m)=>{if(c!=null){var g=ol(o,m);n[xo(g)]=String(c)}})}else{var r=e;for(var i in r){var s=r[i];s!=null&&(n[xo(i)]=s)}}return Object.defineProperty(n,"toString",{value:function(){return Object.keys(this).map(m=>"".concat(m,":").concat(this[m])).join(";")},writable:!1}),n}var et={exports:{}},rl=et.exports,jo;function al(){return jo||(jo=1,(function(e,t){(function(n,o){var r="1.0.41",i="",s="?",c="function",m="undefined",g="object",d="string",h="major",l="model",f="name",u="type",p="vendor",v="version",y="architecture",A="console",E="mobile",C="tablet",x="smarttv",j="wearable",I="embedded",D=500,L="Amazon",P="Apple",Z="ASUS",G="BlackBerry",Q="Browser",re="Chrome",ve="Edge",te="Firefox",ue="Google",F="Honor",ae="Huawei",ie="Lenovo",Ee="LG",ut="Microsoft",He="Motorola",M="Nvidia",q="OnePlus",X="Opera",J="OPPO",xe="Samsung",dt="Sharp",Ke="Sony",Vt="Xiaomi",zt="Zebra",Zn="Facebook",$n="Chromium OS",eo="Mac OS",to=" Browser",ci=function(R,N){var T={};for(var U in R)N[U]&&N[U].length%2===0?T[U]=N[U].concat(R[U]):T[U]=R[U];return T},ft=function(R){for(var N={},T=0;T<R.length;T++)N[R[T].toUpperCase()]=R[T];return N},no=function(R,N){return typeof R===d?Ge(N).indexOf(Ge(R))!==-1:!1},Ge=function(R){return R.toLowerCase()},ui=function(R){return typeof R===d?R.replace(/[^\d\.]/g,i).split(".")[0]:o},Ht=function(R,N){if(typeof R===d)return R=R.replace(/^\s\s*/,i),typeof N===m?R:R.substring(0,D)},Je=function(R,N){for(var T=0,U,be,fe,W,S,pe;T<N.length&&!S;){var Kt=N[T],ao=N[T+1];for(U=be=0;U<Kt.length&&!S&&Kt[U];)if(S=Kt[U++].exec(R),S)for(fe=0;fe<ao.length;fe++)pe=S[++be],W=ao[fe],typeof W===g&&W.length>0?W.length===2?typeof W[1]==c?this[W[0]]=W[1].call(this,pe):this[W[0]]=W[1]:W.length===3?typeof W[1]===c&&!(W[1].exec&&W[1].test)?this[W[0]]=pe?W[1].call(this,pe,W[2]):o:this[W[0]]=pe?pe.replace(W[1],W[2]):o:W.length===4&&(this[W[0]]=pe?W[3].call(this,pe.replace(W[1],W[2])):o):this[W]=pe||o;T+=2}},Ye=function(R,N){for(var T in N)if(typeof N[T]===g&&N[T].length>0){for(var U=0;U<N[T].length;U++)if(no(N[T][U],R))return T===s?o:T}else if(no(N[T],R))return T===s?o:T;return N.hasOwnProperty("*")?N["*"]:R},di={"1.0":"/8","1.2":"/1","1.3":"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"},oo={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2","8.1":"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},ro={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[v,[f,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[v,[f,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[f,v],[/opios[\/ ]+([\w\.]+)/i],[v,[f,X+" Mini"]],[/\bop(?:rg)?x\/([\w\.]+)/i],[v,[f,X+" GX"]],[/\bopr\/([\w\.]+)/i],[v,[f,X]],[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],[v,[f,"Baidu"]],[/\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i],[v,[f,"Maxthon"]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,/(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,/(heytap|ovi|115)browser\/([\d\.]+)/i,/(weibo)__([\d\.]+)/i],[f,v],[/quark(?:pc)?\/([-\w\.]+)/i],[v,[f,"Quark"]],[/\bddg\/([\w\.]+)/i],[v,[f,"DuckDuckGo"]],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[v,[f,"UC"+Q]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i,/micromessenger\/([\w\.]+)/i],[v,[f,"WeChat"]],[/konqueror\/([\w\.]+)/i],[v,[f,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[v,[f,"IE"]],[/ya(?:search)?browser\/([\w\.]+)/i],[v,[f,"Yandex"]],[/slbrowser\/([\w\.]+)/i],[v,[f,"Smart Lenovo "+Q]],[/(avast|avg)\/([\w\.]+)/i],[[f,/(.+)/,"$1 Secure "+Q],v],[/\bfocus\/([\w\.]+)/i],[v,[f,te+" Focus"]],[/\bopt\/([\w\.]+)/i],[v,[f,X+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[v,[f,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[v,[f,"Dolphin"]],[/coast\/([\w\.]+)/i],[v,[f,X+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[v,[f,"MIUI"+to]],[/fxios\/([\w\.-]+)/i],[v,[f,te]],[/\bqihoobrowser\/?([\w\.]*)/i],[v,[f,"360"]],[/\b(qq)\/([\w\.]+)/i],[[f,/(.+)/,"$1Browser"],v],[/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],[[f,/(.+)/,"$1"+to],v],[/samsungbrowser\/([\w\.]+)/i],[v,[f,xe+" Internet"]],[/metasr[\/ ]?([\d\.]+)/i],[v,[f,"Sogou Explorer"]],[/(sogou)mo\w+\/([\d\.]+)/i],[[f,"Sogou Mobile"],v],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i],[f,v],[/(lbbrowser|rekonq)/i,/\[(linkedin)app\]/i],[f],[/ome\/([\w\.]+) \w* ?(iron) saf/i,/ome\/([\w\.]+).+qihu (360)[es]e/i],[v,f],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[f,Zn],v],[/(Klarna)\/([\w\.]+)/i,/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/(daum)apps[\/ ]([\w\.]+)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(alipay)client\/([\w\.]+)/i,/(twitter)(?:and| f.+e\/([\w\.]+))/i,/(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i],[f,v],[/\bgsa\/([\w\.]+) .*safari\//i],[v,[f,"GSA"]],[/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],[v,[f,"TikTok"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[v,[f,re+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[f,re+" WebView"],v],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[v,[f,"Android "+Q]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[f,v],[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],[v,[f,"Mobile Safari"]],[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],[v,f],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[f,[v,Ye,di]],[/(webkit|khtml)\/([\w\.]+)/i],[f,v],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[f,"Netscape"],v],[/(wolvic|librewolf)\/([\w\.]+)/i],[f,v],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[v,[f,te+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/\b(links) \(([\w\.]+)/i],[f,[v,/_/g,"."]],[/(cobalt)\/([\w\.]+)/i],[f,[v,/master.|lts./,""]]],cpu:[[/\b((amd|x|x86[-_]?|wow|win)64)\b/i],[[y,"amd64"]],[/(ia32(?=;))/i,/\b((i[346]|x)86)(pc)?\b/i],[[y,"ia32"]],[/\b(aarch64|arm(v?[89]e?l?|_?64))\b/i],[[y,"arm64"]],[/\b(arm(v[67])?ht?n?[fl]p?)\b/i],[[y,"armhf"]],[/( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i],[[y,"arm"]],[/((ppc|powerpc)(64)?)( mac|;|\))/i],[[y,/ower/,i,Ge]],[/ sun4\w[;\)]/i],[[y,"sparc"]],[/\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i],[[y,Ge]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[l,[p,xe],[u,C]],[/\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]((?!sm-[lr])[-\w]+)/i,/sec-(sgh\w+)/i],[l,[p,xe],[u,E]],[/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],[l,[p,P],[u,E]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[l,[p,P],[u,C]],[/(macintosh);/i],[l,[p,P]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[l,[p,dt],[u,E]],[/\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i],[l,[p,F],[u,C]],[/honor([-\w ]+)[;\)]/i],[l,[p,F],[u,E]],[/\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i],[l,[p,ae],[u,C]],[/(?:huawei)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[l,[p,ae],[u,E]],[/oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,/\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i],[[l,/_/g," "],[p,Vt],[u,C]],[/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i,/ ([\w ]+) miui\/v?\d/i],[[l,/_/g," "],[p,Vt],[u,E]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[l,[p,J],[u,E]],[/\b(opd2(\d{3}a?))(?: bui|\))/i],[l,[p,Ye,{OnePlus:["304","403","203"],"*":J}],[u,C]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[l,[p,"Vivo"],[u,E]],[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],[l,[p,"Realme"],[u,E]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto(?! 360)[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[l,[p,He],[u,E]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[l,[p,He],[u,C]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[l,[p,Ee],[u,C]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv|watch)\w+)/i,/\blg-?([\d\w]+) bui/i],[l,[p,Ee],[u,E]],[/(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,/lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i],[l,[p,ie],[u,C]],[/(nokia) (t[12][01])/i],[p,l,[u,C]],[/(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,/nokia[-_ ]?(([-\w\. ]*))/i],[[l,/_/g," "],[u,E],[p,"Nokia"]],[/(pixel (c|tablet))\b/i],[l,[p,ue],[u,C]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[l,[p,ue],[u,E]],[/droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[l,[p,Ke],[u,E]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[l,"Xperia Tablet"],[p,Ke],[u,C]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[l,[p,q],[u,E]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[l,[p,L],[u,C]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[l,/(.+)/g,"Fire Phone $1"],[p,L],[u,E]],[/(playbook);[-\w\),; ]+(rim)/i],[l,p,[u,C]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[l,[p,G],[u,E]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[l,[p,Z],[u,C]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[l,[p,Z],[u,E]],[/(nexus 9)/i],[l,[p,"HTC"],[u,C]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[p,[l,/_/g," "],[u,E]],[/droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i],[l,[p,"TCL"],[u,C]],[/(itel) ((\w+))/i],[[p,Ge],l,[u,Ye,{tablet:["p10001l","w7001"],"*":"mobile"}]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[l,[p,"Acer"],[u,C]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[l,[p,"Meizu"],[u,E]],[/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],[l,[p,"Ulefone"],[u,E]],[/; (energy ?\w+)(?: bui|\))/i,/; energizer ([\w ]+)(?: bui|\))/i],[l,[p,"Energizer"],[u,E]],[/; cat (b35);/i,/; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i],[l,[p,"Cat"],[u,E]],[/((?:new )?andromax[\w- ]+)(?: bui|\))/i],[l,[p,"Smartfren"],[u,E]],[/droid.+; (a(?:015|06[35]|142p?))/i],[l,[p,"Nothing"],[u,E]],[/; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,/archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i],[l,[p,"Archos"],[u,C]],[/archos ([\w ]+)( b|\))/i,/; (ac[3-6]\d\w{2,8})( b|\))/i],[l,[p,"Archos"],[u,E]],[/(imo) (tab \w+)/i,/(infinix) (x1101b?)/i],[p,l,[u,C]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,/; (hmd|imo) ([\w ]+?)(?: bui|\))/i,/(hp) ([\w ]+\w)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i,/(oppo) ?([\w ]+) bui/i],[p,l,[u,E]],[/(kobo)\s(ereader|touch)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[p,l,[u,C]],[/(surface duo)/i],[l,[p,ut],[u,C]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[l,[p,"Fairphone"],[u,E]],[/(u304aa)/i],[l,[p,"AT&T"],[u,E]],[/\bsie-(\w*)/i],[l,[p,"Siemens"],[u,E]],[/\b(rct\w+) b/i],[l,[p,"RCA"],[u,C]],[/\b(venue[\d ]{2,7}) b/i],[l,[p,"Dell"],[u,C]],[/\b(q(?:mv|ta)\w+) b/i],[l,[p,"Verizon"],[u,C]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[l,[p,"Barnes & Noble"],[u,C]],[/\b(tm\d{3}\w+) b/i],[l,[p,"NuVision"],[u,C]],[/\b(k88) b/i],[l,[p,"ZTE"],[u,C]],[/\b(nx\d{3}j) b/i],[l,[p,"ZTE"],[u,E]],[/\b(gen\d{3}) b.+49h/i],[l,[p,"Swiss"],[u,E]],[/\b(zur\d{3}) b/i],[l,[p,"Swiss"],[u,C]],[/\b((zeki)?tb.*\b) b/i],[l,[p,"Zeki"],[u,C]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[p,"Dragon Touch"],l,[u,C]],[/\b(ns-?\w{0,9}) b/i],[l,[p,"Insignia"],[u,C]],[/\b((nxa|next)-?\w{0,9}) b/i],[l,[p,"NextBook"],[u,C]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[p,"Voice"],l,[u,E]],[/\b(lvtel\-)?(v1[12]) b/i],[[p,"LvTel"],l,[u,E]],[/\b(ph-1) /i],[l,[p,"Essential"],[u,E]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[l,[p,"Envizen"],[u,C]],[/\b(trio[-\w\. ]+) b/i],[l,[p,"MachSpeed"],[u,C]],[/\btu_(1491) b/i],[l,[p,"Rotor"],[u,C]],[/((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i],[l,[p,M],[u,C]],[/(sprint) (\w+)/i],[p,l,[u,E]],[/(kin\.[onetw]{3})/i],[[l,/\./g," "],[p,ut],[u,E]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[l,[p,zt],[u,C]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[l,[p,zt],[u,E]],[/smart-tv.+(samsung)/i],[p,[u,x]],[/hbbtv.+maple;(\d+)/i],[[l,/^/,"SmartTV"],[p,xe],[u,x]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[p,Ee],[u,x]],[/(apple) ?tv/i],[p,[l,P+" TV"],[u,x]],[/crkey/i],[[l,re+"cast"],[p,ue],[u,x]],[/droid.+aft(\w+)( bui|\))/i],[l,[p,L],[u,x]],[/(shield \w+ tv)/i],[l,[p,M],[u,x]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[l,[p,dt],[u,x]],[/(bravia[\w ]+)( bui|\))/i],[l,[p,Ke],[u,x]],[/(mi(tv|box)-?\w+) bui/i],[l,[p,Vt],[u,x]],[/Hbbtv.*(technisat) (.*);/i],[p,l,[u,x]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[p,Ht],[l,Ht],[u,x]],[/droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i],[l,[u,x]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[u,x]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[p,l,[u,A]],[/droid.+; (shield)( bui|\))/i],[l,[p,M],[u,A]],[/(playstation \w+)/i],[l,[p,Ke],[u,A]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[l,[p,ut],[u,A]],[/\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i],[l,[p,xe],[u,j]],[/((pebble))app/i,/(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i],[p,l,[u,j]],[/(ow(?:19|20)?we?[1-3]{1,3})/i],[l,[p,J],[u,j]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[l,[p,P],[u,j]],[/(opwwe\d{3})/i],[l,[p,q],[u,j]],[/(moto 360)/i],[l,[p,He],[u,j]],[/(smartwatch 3)/i],[l,[p,Ke],[u,j]],[/(g watch r)/i],[l,[p,Ee],[u,j]],[/droid.+; (wt63?0{2,3})\)/i],[l,[p,zt],[u,j]],[/droid.+; (glass) \d/i],[l,[p,ue],[u,j]],[/(pico) (4|neo3(?: link|pro)?)/i],[p,l,[u,j]],[/; (quest( \d| pro)?)/i],[l,[p,Zn],[u,j]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[p,[u,I]],[/(aeobc)\b/i],[l,[p,L],[u,I]],[/(homepod).+mac os/i],[l,[p,P],[u,I]],[/windows iot/i],[[u,I]],[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],[l,[u,E]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[l,[u,C]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[u,C]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[u,E]],[/droid .+?; ([\w\. -]+)( bui|\))/i],[l,[p,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[v,[f,ve+"HTML"]],[/(arkweb)\/([\w\.]+)/i],[f,v],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[v,[f,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i,/\b(libweb)/i],[f,v],[/ladybird\//i],[[f,"LibWeb"]],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[v,f]],os:[[/microsoft (windows) (vista|xp)/i],[f,v],[/(windows (?:phone(?: os)?|mobile|iot))[\/ ]?([\d\.\w ]*)/i],[f,[v,Ye,oo]],[/windows nt 6\.2; (arm)/i,/windows[\/ ]([ntce\d\. ]+\w)(?!.+xbox)/i,/(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[v,Ye,oo],[f,"Windows"]],[/[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,/(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,/cfnetwork\/.+darwin/i],[[v,/_/g,"."],[f,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[f,eo],[v,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[v,f],[/(ubuntu) ([\w\.]+) like android/i],[[f,/(.+)/,"$1 Touch"],v],[/(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen|webos)\w*[-\/; ]?([\d\.]*)/i],[f,v],[/\(bb(10);/i],[v,[f,G]],[/(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i],[v,[f,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[v,[f,te+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[v,[f,"webOS"]],[/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],[v,[f,"watchOS"]],[/crkey\/([\d\.]+)/i],[v,[f,re+"cast"]],[/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],[[f,$n],v],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux)(?: arm\w*| x86\w*| ?)([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[f,v],[/(sunos) ?([\w\.\d]*)/i],[[f,"Solaris"],v],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,/(unix) ?([\w\.]*)/i],[f,v]]},de=function(R,N){if(typeof R===g&&(N=R,R=o),!(this instanceof de))return new de(R,N).getResult();var T=typeof n!==m&&n.navigator?n.navigator:o,U=R||(T&&T.userAgent?T.userAgent:i),be=T&&T.userAgentData?T.userAgentData:o,fe=N?ci(ro,N):ro,W=T&&T.userAgent==U;return this.getBrowser=function(){var S={};return S[f]=o,S[v]=o,Je.call(S,U,fe.browser),S[h]=ui(S[v]),W&&T&&T.brave&&typeof T.brave.isBrave==c&&(S[f]="Brave"),S},this.getCPU=function(){var S={};return S[y]=o,Je.call(S,U,fe.cpu),S},this.getDevice=function(){var S={};return S[p]=o,S[l]=o,S[u]=o,Je.call(S,U,fe.device),W&&!S[u]&&be&&be.mobile&&(S[u]=E),W&&S[l]=="Macintosh"&&T&&typeof T.standalone!==m&&T.maxTouchPoints&&T.maxTouchPoints>2&&(S[l]="iPad",S[u]=C),S},this.getEngine=function(){var S={};return S[f]=o,S[v]=o,Je.call(S,U,fe.engine),S},this.getOS=function(){var S={};return S[f]=o,S[v]=o,Je.call(S,U,fe.os),W&&!S[f]&&be&&be.platform&&be.platform!="Unknown"&&(S[f]=be.platform.replace(/chrome os/i,$n).replace(/macos/i,eo)),S},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return U},this.setUA=function(S){return U=typeof S===d&&S.length>D?Ht(S,D):S,this},this.setUA(U),this};de.VERSION=r,de.BROWSER=ft([f,v,h]),de.CPU=ft([y]),de.DEVICE=ft([l,p,u,A,E,x,C,j,I]),de.ENGINE=de.OS=ft([f,v]),e.exports&&(t=e.exports=de),t.UAParser=de;var De=typeof n!==m&&(n.jQuery||n.Zepto);if(De&&!De.ua){var pt=new de;De.ua=pt.getResult(),De.ua.get=function(){return pt.getUA()},De.ua.set=function(R){pt.setUA(R);var N=pt.getResult();for(var T in N)De.ua[T]=N[T]}}})(typeof window=="object"?window:rl)})(et,et.exports)),et.exports}var il=al();const It=5,sl=3,St=11,Xr=40,ll=5,cl=10,Ze={newline:10,reset:27};function ul(e){if(!Number.isSafeInteger(e))throw new Error(`integer expected: ${e}`)}function dl(e){if(!Number.isSafeInteger(e)||e<1||e>40)throw new Error(`Invalid version=${e}. Expected number [1..40]`)}function ke(e,t){return e.toString(2).padStart(t,"0")}function _o(e,t){const n=e%t;return n>=0?n:t+n}function le(e,t){return new Array(e).fill(t)}function Bo(e){let t=0,n=0;for(const i of e)t=Math.max(t,i.length),n+=i.length;const o=new Uint8Array(n);let r=0;for(let i=0;i<t;i++)for(const s of e)i<s.length&&(o[r++]=s[i]);return o}function fl(){let e,t=1/0;return{add(n,o){n>=t||(e=o,t=n)},get:()=>e,score:()=>t}}function Io(e){return{has:t=>e.includes(t),decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!="string")throw new Error("alphabet.decode input should be array of strings");return t.map(n=>{if(typeof n!="string")throw new Error(`alphabet.decode: not string element=${n}`);const o=e.indexOf(n);if(o===-1)throw new Error(`Unknown letter: "${n}". Allowed: ${e}`);return o})},encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!="number")throw new Error("alphabet.encode input should be an array of numbers");return t.map(n=>{if(ul(n),n<0||n>=e.length)throw new Error(`Digit index outside alphabet: ${n} (alphabet: ${e.length})`);return e[n]})}}}class se{static size(t,n){if(typeof t=="number"&&(t={height:t,width:t}),!Number.isSafeInteger(t.height)&&t.height!==1/0)throw new Error(`Bitmap: invalid height=${t.height} (${typeof t.height})`);if(!Number.isSafeInteger(t.width)&&t.width!==1/0)throw new Error(`Bitmap: invalid width=${t.width} (${typeof t.width})`);return n!==void 0&&(t={width:Math.min(t.width,n.width),height:Math.min(t.height,n.height)}),t}static fromString(t){t=t.replace(/^\n+/g,"").replace(/\n+$/g,"");const n=t.split(String.fromCharCode(Ze.newline)),o=n.length,r=new Array(o);let i;for(const s of n){const c=s.split("").map(m=>{if(m==="X")return!0;if(m===" ")return!1;if(m!=="?")throw new Error(`Bitmap.fromString: unknown symbol=${m}`)});if(i&&c.length!==i)throw new Error(`Bitmap.fromString different row sizes: width=${i} cur=${c.length}`);i=c.length,r.push(c)}return i||(i=0),new se({height:o,width:i},r)}data;height;width;constructor(t,n){const{height:o,width:r}=se.size(t);this.data=n||Array.from({length:o},()=>le(r,void 0)),this.height=o,this.width=r}point(t){return this.data[t.y][t.x]}isInside(t){return 0<=t.x&&t.x<this.width&&0<=t.y&&t.y<this.height}size(t){if(!t)return{height:this.height,width:this.width};const{x:n,y:o}=this.xy(t);return{height:this.height-o,width:this.width-n}}xy(t){if(typeof t=="number"&&(t={x:t,y:t}),!Number.isSafeInteger(t.x))throw new Error(`Bitmap: invalid x=${t.x}`);if(!Number.isSafeInteger(t.y))throw new Error(`Bitmap: invalid y=${t.y}`);return t.x=_o(t.x,this.width),t.y=_o(t.y,this.height),t}rect(t,n,o){const{x:r,y:i}=this.xy(t),{height:s,width:c}=se.size(n,this.size({x:r,y:i}));for(let m=0;m<s;m++)for(let g=0;g<c;g++)this.data[i+m][r+g]=typeof o=="function"?o({x:g,y:m},this.data[i+m][r+g]):o;return this}rectRead(t,n,o){return this.rect(t,n,(r,i)=>(o(r,i),i))}hLine(t,n,o){return this.rect(t,{width:n,height:1},o)}vLine(t,n,o){return this.rect(t,{width:1,height:n},o)}border(t=2,n){const o=this.height+2*t,r=this.width+2*t,i=le(t,n),s=Array.from({length:t},()=>le(r,n));return new se({height:o,width:r},[...s,...this.data.map(c=>[...i,...c,...i]),...s])}embed(t,n){return this.rect(t,n.size(),({x:o,y:r})=>n.data[r][o])}rectSlice(t,n=this.size()){const o=new se(se.size(n,this.size(this.xy(t))));return this.rect(t,n,({x:r,y:i},s)=>o.data[i][r]=s),o}inverse(){const{height:t,width:n}=this;return new se({height:n,width:t}).rect({x:0,y:0},1/0,({x:r,y:i})=>this.data[r][i])}scale(t){if(!Number.isSafeInteger(t)||t>1024)throw new Error(`invalid scale factor: ${t}`);const{height:n,width:o}=this;return new se({height:t*n,width:t*o}).rect({x:0,y:0},1/0,({x:i,y:s})=>this.data[Math.floor(s/t)][Math.floor(i/t)])}clone(){return new se(this.size()).rect({x:0,y:0},this.size(),({x:n,y:o})=>this.data[o][n])}assertDrawn(){this.rectRead(0,1/0,(t,n)=>{if(typeof n!="boolean")throw new Error(`Invalid color type=${typeof n}`)})}toString(){return this.data.map(t=>t.map(n=>n===void 0?"?":n?"X":" ").join("")).join(String.fromCharCode(Ze.newline))}toASCII(){const{height:t,width:n,data:o}=this;let r="";for(let i=0;i<t;i+=2){for(let s=0;s<n;s++){const c=o[i][s],m=i+1>=t?!0:o[i+1][s];!c&&!m?r+="█":!c&&m?r+="▀":c&&!m?r+="▄":c&&m&&(r+=" ")}r+=String.fromCharCode(Ze.newline)}return r}toTerm(){const t=String.fromCharCode(Ze.reset),n=t+"[0m",o=t+"[1;47m  "+n,r=t+"[40m  "+n;return this.data.map(i=>i.map(s=>s?r:o).join("")).join(String.fromCharCode(Ze.newline))}toSVG(t=!0){let n=`<svg viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">`,o="",r;return this.rectRead(0,1/0,(i,s)=>{if(!s)return;const{x:c,y:m}=i;if(!t){n+=`<rect x="${c}" y="${m}" width="1" height="1" />`;return}let g=`M${c} ${m}`;if(r){const h=`m${c-r.x} ${m-r.y}`;h.length<=g.length&&(g=h)}const d=c<10?`H${c}`:"h-1";o+=`${g}h1v1${d}Z`,r=i}),t&&(n+=`<path d="${o}"/>`),n+="</svg>",n}toGIF(){const t=c=>[c&255,c>>>8&255],n=[...t(this.width),...t(this.height)],o=[];this.rectRead(0,1/0,(c,m)=>o.push(+(m===!0)));const r=126,i=[71,73,70,56,55,97,...n,246,0,0,255,255,255,...le(381,0),44,0,0,0,0,...n,0,7],s=Math.floor(o.length/r);for(let c=0;c<s;c++)i.push(r+1,128,...o.slice(r*c,r*(c+1)).map(m=>+m));return i.push(o.length%r+1,128,...o.slice(s*r).map(c=>+c)),i.push(1,129,0,59),new Uint8Array(i)}toImage(t=!1){const{height:n,width:o}=this.size(),r=new Uint8Array(n*o*(t?3:4));let i=0;for(let s=0;s<n;s++)for(let c=0;c<o;c++){const m=this.data[s][c]?0:255;r[i++]=m,r[i++]=m,r[i++]=m,t||(r[i++]=255)}return{height:n,width:o,data:r}}}const So=["low","medium","quartile","high"],To=["numeric","alphanumeric","byte","kanji","eci"],pl=[26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706],hl={low:[7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],medium:[10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],quartile:[13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],high:[17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]},ml={low:[1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],medium:[1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],quartile:[1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],high:[1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]},ee={size:{encode:e=>21+4*(e-1),decode:e=>(e-17)/4},sizeType:e=>Math.floor((e+7)/17),alignmentPatterns(e){if(e===1)return[];const t=6,n=ee.size.encode(e)-t-1,o=n-t,r=Math.ceil(o/28);let i=Math.floor(o/r);i%2?i+=1:o%r*2>=r&&(i+=2);const s=[t];for(let c=1;c<r;c++)s.push(n-(r-c)*i);return s.push(n),s},ECCode:{low:1,medium:0,quartile:3,high:2},formatMask:21522,formatBits(e,t){const n=ee.ECCode[e]<<3|t;let o=n;for(let r=0;r<10;r++)o=o<<1^(o>>9)*1335;return(n<<10|o)^ee.formatMask},versionBits(e){let t=e;for(let n=0;n<12;n++)t=t<<1^(t>>11)*7973;return e<<12|t},alphabet:{numeric:Io("0123456789"),alphanumerc:Io("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:")},lengthBits(e,t){return{numeric:[10,12,14],alphanumeric:[9,11,13],byte:[8,16,16],kanji:[8,10,12],eci:[0,0,0]}[t][ee.sizeType(e)]},modeBits:{numeric:"0001",alphanumeric:"0010",byte:"0100",kanji:"1000",eci:"0111"},capacity(e,t){const n=pl[e-1],o=hl[t][e-1],r=ml[t][e-1],i=Math.floor(n/r)-o,s=r-n%r;return{words:o,numBlocks:r,shortBlocks:s,blockLen:i,capacity:(n-o*r)*8,total:(o+i)*r+r-s}}},Sn=[(e,t)=>(e+t)%2==0,(e,t)=>t%2==0,(e,t)=>e%3==0,(e,t)=>(e+t)%3==0,(e,t)=>(Math.floor(t/2)+Math.floor(e/3))%2==0,(e,t)=>e*t%2+e*t%3==0,(e,t)=>(e*t%2+e*t%3)%2==0,(e,t)=>((e+t)%2+e*t%3)%2==0],_={tables:(e=>{const t=le(256,0),n=le(256,0);for(let o=0,r=1;o<256;o++)t[o]=r,n[r]=o,r<<=1,r&256&&(r^=e);return{exp:t,log:n}})(285),exp:e=>_.tables.exp[e],log(e){if(e===0)throw new Error(`GF.log: invalid arg=${e}`);return _.tables.log[e]%255},mul(e,t){return e===0||t===0?0:_.tables.exp[(_.tables.log[e]+_.tables.log[t])%255]},add:(e,t)=>e^t,pow:(e,t)=>_.tables.exp[_.tables.log[e]*t%255],inv(e){if(e===0)throw new Error(`GF.inverse: invalid arg=${e}`);return _.tables.exp[255-_.tables.log[e]]},polynomial(e){if(e.length==0)throw new Error("GF.polymomial: invalid length");if(e[0]!==0)return e;let t=0;for(;t<e.length-1&&e[t]==0;t++);return e.slice(t)},monomial(e,t){if(e<0)throw new Error(`GF.monomial: invalid degree=${e}`);if(t==0)return[0];let n=le(e+1,0);return n[0]=t,_.polynomial(n)},degree:e=>e.length-1,coefficient:(e,t)=>e[_.degree(e)-t],mulPoly(e,t){if(e[0]===0||t[0]===0)return[0];const n=le(e.length+t.length-1,0);for(let o=0;o<e.length;o++)for(let r=0;r<t.length;r++)n[o+r]=_.add(n[o+r],_.mul(e[o],t[r]));return _.polynomial(n)},mulPolyScalar(e,t){if(t==0)return[0];if(t==1)return e;const n=le(e.length,0);for(let o=0;o<e.length;o++)n[o]=_.mul(e[o],t);return _.polynomial(n)},mulPolyMonomial(e,t,n){if(t<0)throw new Error("GF.mulPolyMonomial: invalid degree");if(n==0)return[0];const o=le(e.length+t,0);for(let r=0;r<e.length;r++)o[r]=_.mul(e[r],n);return _.polynomial(o)},addPoly(e,t){if(e[0]===0)return t;if(t[0]===0)return e;let n=e,o=t;n.length>o.length&&([n,o]=[o,n]);let r=le(o.length,0),i=o.length-n.length,s=o.slice(0,i);for(let c=0;c<s.length;c++)r[c]=s[c];for(let c=i;c<o.length;c++)r[c]=_.add(n[c-i],o[c]);return _.polynomial(r)},remainderPoly(e,t){const n=Array.from(e);for(let o=0;o<e.length-t.length+1;o++){const r=n[o];if(r!==0)for(let i=1;i<t.length;i++)t[i]!==0&&(n[o+i]=_.add(n[o+i],_.mul(t[i],r)))}return n.slice(e.length-t.length+1,n.length)},divisorPoly(e){let t=[1];for(let n=0;n<e;n++)t=_.mulPoly(t,[1,_.pow(2,n)]);return t},evalPoly(e,t){if(t==0)return _.coefficient(e,0);let n=e[0];for(let o=1;o<e.length;o++)n=_.add(_.mul(t,n),e[o]);return n},euclidian(e,t,n){_.degree(e)<_.degree(t)&&([e,t]=[t,e]);let o=e,r=t,i=[0],s=[1];for(;2*_.degree(r)>=n;){let g=o,d=i;if(o=r,i=s,o[0]===0)throw new Error("rLast[0] === 0");r=g;let h=[0];const l=_.inv(o[0]);for(;_.degree(r)>=_.degree(o)&&r[0]!==0;){const f=_.degree(r)-_.degree(o),u=_.mul(r[0],l);h=_.addPoly(h,_.monomial(f,u)),r=_.addPoly(r,_.mulPolyMonomial(o,f,u))}if(h=_.mulPoly(h,i),s=_.addPoly(h,d),_.degree(r)>=_.degree(o))throw new Error(`Division failed r: ${r}, rLast: ${o}`)}const c=_.coefficient(s,0);if(c==0)throw new Error("sigmaTilde(0) was zero");const m=_.inv(c);return[_.mulPolyScalar(s,m),_.mulPolyScalar(r,m)]}};function gl(e){return{encode(t){const n=_.divisorPoly(e),o=Array.from(t);return o.push(...n.slice(0,-1).fill(0)),Uint8Array.from(_.remainderPoly(o,n))},decode(t){const n=t.slice(),o=_.polynomial(Array.from(t));let r=le(e,0),i=!1;for(let h=0;h<e;h++){const l=_.evalPoly(o,_.exp(h));r[r.length-1-h]=l,l!==0&&(i=!0)}if(!i)return n;r=_.polynomial(r);const s=_.monomial(e,1),[c,m]=_.euclidian(s,r,e),g=le(_.degree(c),0);let d=0;for(let h=1;h<256&&d<g.length;h++)_.evalPoly(c,h)===0&&(g[d++]=_.inv(h));if(d!==g.length)throw new Error("RS.decode: invalid errors number");for(let h=0;h<g.length;h++){const l=n.length-1-_.log(g[h]);if(l<0)throw new Error("RS.decode: invalid error location");const f=_.inv(g[h]);let u=1;for(let p=0;p<g.length;p++)h!==p&&(u=_.mul(u,_.add(1,_.mul(g[p],f))));n[l]=_.add(n[l],_.mul(_.evalPoly(m,f),_.inv(u)))}return n}}}function wl(e,t){const{words:n,shortBlocks:o,numBlocks:r,blockLen:i,total:s}=ee.capacity(e,t),c=gl(n);return{encode(m){const g=[],d=[];for(let u=0;u<r;u++){const p=u<o,v=i+(p?0:1);g.push(m.subarray(0,v)),d.push(c.encode(m.subarray(0,v))),m=m.subarray(v)}const h=Bo(g),l=Bo(d),f=new Uint8Array(h.length+l.length);return f.set(h),f.set(l,h.length),f},decode(m){if(m.length!==s)throw new Error(`interleave.decode: len(data)=${m.length}, total=${s}`);const g=[];for(let l=0;l<r;l++){const f=l<o;g.push(new Uint8Array(n+i+(f?0:1)))}let d=0;for(let l=0;l<i;l++)for(let f=0;f<r;f++)g[f][l]=m[d++];for(let l=o;l<r;l++)g[l][i]=m[d++];for(let l=i;l<i+n;l++)for(let f=0;f<r;f++){const u=f<o;g[f][l+(u?0:1)]=m[d++]}const h=[];for(const l of g)h.push(...Array.from(c.decode(l)).slice(0,-n));return Uint8Array.from(h)}}}function vl(e,t,n,o=!1){const r=ee.size.encode(e);let i=new se(r+2);const s=new se(3).rect(0,3,!0).border(1,!1).border(1,!0).border(1,!1);i=i.embed(0,s).embed({x:-s.width,y:0},s).embed({x:0,y:-s.height},s),i=i.rectSlice(1,r);const c=new se(1).rect(0,1,!0).border(1,!1).border(1,!0),m=ee.alignmentPatterns(e);for(const g of m)for(const d of m)i.data[g][d]===void 0&&i.embed({x:d-2,y:g-2},c);i=i.hLine({x:0,y:6},1/0,({x:g},d)=>d===void 0?g%2==0:d).vLine({x:6,y:0},1/0,({y:g},d)=>d===void 0?g%2==0:d);{const g=ee.formatBits(t,n),d=h=>!o&&(g>>h&1)==1;for(let h=0;h<6;h++)i.data[h][8]=d(h);for(let h=6;h<8;h++)i.data[h+1][8]=d(h);for(let h=8;h<15;h++)i.data[r-15+h][8]=d(h);for(let h=0;h<8;h++)i.data[8][r-h-1]=d(h);for(let h=8;h<9;h++)i.data[8][15-h-1+1]=d(h);for(let h=9;h<15;h++)i.data[8][15-h-1]=d(h);i.data[r-8][8]=!o}if(e>=7){const g=ee.versionBits(e);for(let d=0;d<18;d+=1){const h=!o&&(g>>d&1)==1,l=Math.floor(d/3),f=d%3+r-8-3;i.data[l][f]=h,i.data[f][l]=h}}return i}function bl(e,t,n){const o=e.height,r=Sn[t];let i=-1,s=o-1;for(let c=o-1;c>0;c-=2){for(c==6&&(c=5);;s+=i){for(let m=0;m<2;m+=1){const g=c-m;e.data[s][g]===void 0&&n(g,s,r(g,s))}if(s+i<0||s+i>=o)break}i=-i}}function Cl(e){let t="numeric";for(let n of e)if(!ee.alphabet.numeric.has(n)&&(t="alphanumeric",!ee.alphabet.alphanumerc.has(n)))return"byte";return t}function yl(e){if(typeof e!="string")throw new Error(`utf8ToBytes expected string, got ${typeof e}`);return new Uint8Array(new TextEncoder().encode(e))}function Do(e,t,n,o,r=yl){let i="",s=n.length;if(o==="numeric"){const l=ee.alphabet.numeric.decode(n.split("")),f=l.length;for(let u=0;u<f-2;u+=3)i+=ke(l[u]*100+l[u+1]*10+l[u+2],10);f%3===1?i+=ke(l[f-1],4):f%3===2&&(i+=ke(l[f-2]*10+l[f-1],7))}else if(o==="alphanumeric"){const l=ee.alphabet.alphanumerc.decode(n.split("")),f=l.length;for(let u=0;u<f-1;u+=2)i+=ke(l[u]*45+l[u+1],11);f%2==1&&(i+=ke(l[f-1],6))}else if(o==="byte"){const l=r(n);s=l.length,i=Array.from(l).map(f=>ke(f,8)).join("")}else throw new Error("encode: unsupported type");const{capacity:c}=ee.capacity(e,t),m=ke(s,ee.lengthBits(e,o));let g=ee.modeBits[o]+m+i;if(g.length>c)throw new Error("Capacity overflow");g+="0".repeat(Math.min(4,Math.max(0,c-g.length))),g.length%8&&(g+="0".repeat(8-g.length%8));const d="1110110000010001";for(let l=0;g.length!==c;l++)g+=d[l%d.length];const h=Uint8Array.from(g.match(/(.{8})/g).map(l=>+`0b${l}`));return wl(e,t).encode(h)}function Mo(e,t,n,o,r=!1){const i=vl(e,t,o,r);let s=0;const c=8*n.length;if(bl(i,o,(m,g,d)=>{let h=!1;s<c&&(h=(n[s>>>3]>>(7-s&7)&1)!==0,s++),i.data[g][m]=h!==d}),s!==c)throw new Error("QR: bytes left after draw");return i}function Al(e){const t=e.length;if(t<=1)return 0;let n=0,o=1,r=e[0];for(let i=1;i<t;i++){const s=e[i];s===r?o++:(o>=It&&(n+=o-2),o=1,r=s)}return o>=It&&(n+=o-2),n}function El(e,t,n){if(n<=1)return 0;let o=0,r=1,i=e[0][t];for(let s=1;s<n;s++){const c=e[s][t];c===i?r++:(r>=It&&(o+=r-2),r=1,i=c)}return r>=It&&(o+=r-2),o}function xl(e){const t=e.length;if(t<St)return 0;let n=0;const o=t-St;for(let r=0;r<=o;r++){const i=!e[r]&&!e[r+1]&&!e[r+2]&&!e[r+3]&&e[r+4]&&!e[r+5]&&e[r+6]&&e[r+7]&&e[r+8]&&!e[r+9]&&e[r+10],s=e[r]&&!e[r+1]&&e[r+2]&&e[r+3]&&e[r+4]&&!e[r+5]&&e[r+6]&&!e[r+7]&&!e[r+8]&&!e[r+9]&&!e[r+10];(i||s)&&(n+=Xr)}return n}function kl(e,t,n){if(n<St)return 0;let o=0;const r=t,i=n-St;for(let s=0;s<=i;s++){const c=!e[s][r]&&!e[s+1][r]&&!e[s+2][r]&&!e[s+3][r]&&e[s+4][r]&&!e[s+5][r]&&e[s+6][r]&&e[s+7][r]&&e[s+8][r]&&!e[s+9][r]&&e[s+10][r],m=e[s][r]&&!e[s+1][r]&&e[s+2][r]&&e[s+3][r]&&e[s+4][r]&&!e[s+5][r]&&e[s+6][r]&&!e[s+7][r]&&!e[s+8][r]&&!e[s+9][r]&&!e[s+10][r];(c||m)&&(o+=Xr)}return o}function jl(e){const t=e.data,n=e.width|0,o=e.height|0;if(n===0||o===0)return 0;let r=0;for(let u=0;u<n;u++)r+=Al(t[u]);for(let u=0;u<o;u++)r+=El(t,u,n);let i=0;const s=n-1,c=o-1;for(let u=0;u<s;u++){const p=t[u],v=t[u+1];for(let y=0;y<c;y++){const A=p[y];A===v[y]&&A===p[y+1]&&A===v[y+1]&&(i+=sl)}}let m=0;for(let u=0;u<n;u++)m+=xl(t[u]);for(let u=0;u<o;u++)m+=kl(t,u,n);let g=0;for(let u=0;u<n;u++){const p=t[u];for(let v=0;v<o;v++)p[v]&&g++}const d=n*o,h=g*100/d,l=Math.abs(h-50),f=cl*Math.floor(l/ll);return r+i+m+f}function _l(e,t,n,o){if(o===void 0){const r=fl();for(let i=0;i<Sn.length;i++)r.add(jl(Mo(e,t,n,i,!0)),i);o=r.get()}if(o===void 0)throw new Error("Cannot find mask");return Mo(e,t,n,o)}function Bl(e){if(!So.includes(e))throw new Error(`Invalid error correction mode=${e}. Expected: ${So}`)}function Il(e){if(!To.includes(e))throw new Error(`Encoding: invalid mode=${e}. Expected: ${To}`);if(e==="kanji"||e==="eci")throw new Error(`Encoding: ${e} is not supported (yet?).`)}function Sl(e){if(![0,1,2,3,4,5,6,7].includes(e)||!Sn[e])throw new Error(`Invalid mask=${e}. Expected number [0..7]`)}function Tl(e,t="raw",n={}){const o=n.ecc!==void 0?n.ecc:"medium";Bl(o);const r=n.encoding!==void 0?n.encoding:Cl(e);Il(r),n.mask!==void 0&&Sl(n.mask);let i=n.version,s,c=new Error("Unknown error");if(i!==void 0)dl(i),s=Do(i,o,e,r,n.textEncoder);else for(let d=1;d<=40;d++)try{s=Do(d,o,e,r,n.textEncoder),i=d;break}catch(h){c=h}if(!i||!s)throw c;let m=_l(i,o,s,n.mask);m.assertDrawn();const g=n.border===void 0?2:n.border;if(!Number.isSafeInteger(g))throw new Error(`invalid border type=${typeof g}`);if(m=m.border(g,!1),n.scale!==void 0&&(m=m.scale(n.scale)),t==="raw")return m.data;if(t==="ascii")return m.toASCII();if(t==="svg")return m.toSVG(n.optimize);if(t==="gif")return m.toGIF();if(t==="term")return m.toTerm();throw new Error(`Unknown output: ${t}`)}function Dl(e,t={}){const{errorCorrection:n,version:o}=t,r=Tl(e,"raw",{border:0,ecc:n,scale:1,version:o});return{edgeLength:r.length,finderLength:7,grid:r,value:e}}function me(e){const{arena:t,...n}=e;return K.jsxs(me.Root,{...n,children:[K.jsx(me.Finder,{}),K.jsx(me.Cells,{}),t&&K.jsx(me.Arena,{children:typeof t=="string"?K.jsx("img",{alt:"Arena",src:t,style:{borderRadius:1,height:"100%",objectFit:"cover",width:"100%"}}):t})]})}(function(e){e.Context=b.createContext(null);function t(i){const{children:s,size:c="100%",value:m,version:g,errorCorrection:d,...h}=i,l=b.useMemo(()=>(b.Children.map(s,E=>!b.isValidElement(E)||typeof E.type=="string"?null:"displayName"in E.type&&E.type.displayName==="Arena"?!0:null)??[]).some(Boolean),[s]),f=b.useMemo(()=>{let E=d;return l&&d==="low"&&(E="medium"),Dl(m,{errorCorrection:E,version:g})},[m,l,d,g]),u=1,p=f.edgeLength*u,v=f.finderLength*u/2,y=l?Math.floor(p/4):0,A=b.useMemo(()=>({arenaSize:y,cellSize:u,edgeSize:p,qrcode:f,finderSize:v}),[y,p,f,v]);return K.jsx(e.Context.Provider,{value:A,children:K.jsxs("svg",{...h,width:c,height:c,viewBox:`0 0 ${p} ${p}`,xmlns:"http://www.w3.org/2000/svg",children:[K.jsx("title",{children:"QR Code"}),s]})})}e.Root=t,(function(i){i.displayName="Root"})(t=e.Root||(e.Root={}));function n(i){const{className:s,fill:c,innerClassName:m,radius:g=.25}=i,{cellSize:d,edgeSize:h,finderSize:l}=b.useContext(e.Context);function f({position:u}){let p=l-(l-d)-d/2;u==="top-right"&&(p=h-l-(l-d)-d/2);let v=l-(l-d)-d/2;u==="bottom-left"&&(v=h-l-(l-d)-d/2);let y=l-d*1.5;u==="top-right"&&(y=h-l-d*1.5);let A=l-d*1.5;return u==="bottom-left"&&(A=h-l-d*1.5),K.jsxs(K.Fragment,{children:[K.jsx("rect",{className:s,stroke:c??"currentColor",fill:"transparent",x:p,y:v,width:d+(l-d)*2,height:d+(l-d)*2,rx:2*g*(l-d),ry:2*g*(l-d),strokeWidth:d}),K.jsx("rect",{className:m,fill:c??"currentColor",x:y,y:A,width:d*3,height:d*3,rx:2*g*d,ry:2*g*d})]})}return K.jsxs(K.Fragment,{children:[K.jsx(f,{position:"top-left"}),K.jsx(f,{position:"top-right"}),K.jsx(f,{position:"bottom-left"})]})}e.Finder=n,(function(i){i.displayName="Finder"})(n=e.Finder||(e.Finder={}));function o(i){const{className:s,fill:c="currentColor",inset:m=!0,radius:g=1}=i,{arenaSize:d,cellSize:h,qrcode:l}=b.useContext(e.Context),{edgeLength:f,finderLength:u}=l,p=b.useMemo(()=>{let v="";for(let y=0;y<l.grid.length;y++){const A=l.grid[y];if(A)for(let E=0;E<A.length;E++){if(!A[E])continue;const x=f/2-d/2,j=x+d;if(y>=x&&y<=j&&E>=x&&E<=j)continue;const I=y<u&&E<u,D=y<u&&E>=f-u,L=y>=f-u&&E<u;if(I||D||L)continue;const P=m?h*.1:0,Z=(h-P*2)/2,G=E*h+h/2,Q=y*h+h/2,re=G-Z,ve=G+Z,te=Q-Z,ue=Q+Z,F=g*Z;v+=[`M ${re+F},${te}`,`L ${ve-F},${te}`,`A ${F},${F} 0 0,1 ${ve},${te+F}`,`L ${ve},${ue-F}`,`A ${F},${F} 0 0,1 ${ve-F},${ue}`,`L ${re+F},${ue}`,`A ${F},${F} 0 0,1 ${re},${ue-F}`,`L ${re},${te+F}`,`A ${F},${F} 0 0,1 ${re+F},${te}`,"z"].join(" ")}}return v},[d,h,f,u,l.grid,m,g]);return K.jsx("path",{className:s,d:p,fill:c})}e.Cells=o,(function(i){i.displayName="Cells"})(o=e.Cells||(e.Cells={}));function r(i){const{children:s}=i,{arenaSize:c,cellSize:m,edgeSize:g}=b.useContext(e.Context),d=Math.ceil(g/2-c/2),h=c+c%2,l=m/2;return K.jsx("foreignObject",{x:d,y:d,width:h,height:h,children:K.jsx("div",{style:{alignItems:"center",display:"flex",fontSize:1,justifyContent:"center",height:"100%",overflow:"hidden",width:"100%",padding:l,boxSizing:"border-box"},children:s})})}e.Arena=r,(function(i){i.displayName="Arena"})(r=e.Arena||(e.Arena={}))})(me||(me={}));function Ml(e={}){let t,n,o,r;return ye(i=>({id:"baseAccount",name:"Base Account",rdns:"app.base.account",type:"baseAccount",async connect({chainId:s,withCapabilities:c,...m}={}){try{const g=await this.getProvider(),d=s??i.chains[0]?.id;if(!d)throw new Et;const h=await g.request({method:"wallet_connect",params:[{capabilities:"capabilities"in m&&m.capabilities?m.capabilities:{},chainIds:[Ce(d),...i.chains.filter(u=>u.id!==d).map(u=>Ce(u.id))]}]}),l=h.accounts.map(u=>({address:ge(u.address),capabilities:u.capabilities??{}}));let f=Number(h.chainIds[0]);return n||(n=this.onAccountsChanged.bind(this),g.on("accountsChanged",n)),o||(o=this.onChainChanged.bind(this),g.on("chainChanged",o)),r||(r=this.onDisconnect.bind(this),g.on("disconnect",r)),s&&f!==s&&(f=(await this.switchChain({chainId:s}).catch(p=>{if(p.code===ne.code)throw p;return{id:f}}))?.id??f),{accounts:c?l:l.map(u=>u.address),chainId:f}}catch(g){throw/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(g.message)?new ne(g):g}},async disconnect(){const s=await this.getProvider();n&&(s.removeListener("accountsChanged",n),n=void 0),o&&(s.removeListener("chainChanged",o),o=void 0),r&&(s.removeListener("disconnect",r),r=void 0),s.disconnect()},async getAccounts(){return(await(await this.getProvider()).request({method:"eth_accounts"})).map(c=>ge(c))},async getChainId(){const c=await(await this.getProvider()).request({method:"eth_chainId"});return Number(c)},async getProvider(){if(!t){const s=typeof e.preference=="string"?{options:e.preference}:{...e.preference,options:e.preference?.options??"all"},{createBaseAccountSDK:c}=await k(async()=>{const{createBaseAccountSDK:g}=await import("./index-B1pTDTCA.js");return{createBaseAccountSDK:g}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]));t=c({...e,appChainIds:i.chains.map(g=>g.id),preference:s}).getProvider()}return t},async isAuthorized(){try{return!!(await this.getAccounts()).length}catch{return!1}},async switchChain({addEthereumChainParameter:s,chainId:c}){const m=i.chains.find(d=>d.id===c);if(!m)throw new Fe(new Et);const g=await this.getProvider();try{return await g.request({method:"wallet_switchEthereumChain",params:[{chainId:Ce(m.id)}]}),m}catch(d){if(d.code===4902)try{let h;s?.blockExplorerUrls?h=s.blockExplorerUrls:h=m.blockExplorers?.default.url?[m.blockExplorers?.default.url]:[];let l;s?.rpcUrls?.length?l=s.rpcUrls:l=[m.rpcUrls.default?.http[0]??""];const f={blockExplorerUrls:h,chainId:Ce(c),chainName:s?.chainName??m.name,iconUrls:s?.iconUrls,nativeCurrency:s?.nativeCurrency??m.nativeCurrency,rpcUrls:l};return await g.request({method:"wallet_addEthereumChain",params:[f]}),m}catch(h){throw new ne(h)}throw new Fe(d)}},onAccountsChanged(s){s.length===0?this.onDisconnect():i.emitter.emit("change",{accounts:s.map(c=>ge(c))})},onChainChanged(s){const c=Number(s);i.emitter.emit("change",{chainId:c})},async onDisconnect(s){i.emitter.emit("disconnect");const c=await this.getProvider();n&&(c.removeListener("accountsChanged",n),n=void 0),o&&(c.removeListener("chainChanged",o),o=void 0),r&&(c.removeListener("disconnect",r),r=void 0)}}))}Tn.type="metaMask";function Tn(e={}){let t,n,o,r,i,s,c,m;return ye(g=>({id:"metaMaskSDK",name:"MetaMask",rdns:["io.metamask","io.metamask.mobile"],type:Tn.type,async setup(){const d=await this.getProvider();d?.on&&(s||(s=this.onConnect.bind(this),d.on("connect",s)),r||(r=this.onAccountsChanged.bind(this),d.on("accountsChanged",r)))},async connect({chainId:d,isReconnecting:h,withCapabilities:l}={}){const f=await this.getProvider();c||(c=this.onDisplayUri,f.on("display_uri",c));let u=[];h&&(u=await this.getAccounts().catch(()=>[]));try{let p,v;u?.length||(e.connectAndSign||e.connectWith?(e.connectAndSign?p=await t.connectAndSign({msg:e.connectAndSign}):e.connectWith&&(v=await t.connectWith({method:e.connectWith.method,params:e.connectWith.params})),u=await this.getAccounts()):u=(await t.connect()).map(E=>ge(E)));let y=await this.getChainId();return d&&y!==d&&(y=(await this.switchChain({chainId:d}).catch(E=>{if(E.code===ne.code)throw E;return{id:y}}))?.id??y),c&&(f.removeListener("display_uri",c),c=void 0),p?f.emit("connectAndSign",{accounts:u,chainId:y,signResponse:p}):v&&f.emit("connectWith",{accounts:u,chainId:y,connectWithResponse:v}),s&&(f.removeListener("connect",s),s=void 0),r||(r=this.onAccountsChanged.bind(this),f.on("accountsChanged",r)),i||(i=this.onChainChanged.bind(this),f.on("chainChanged",i)),m||(m=this.onDisconnect.bind(this),f.on("disconnect",m)),{accounts:l?u.map(A=>({address:A,capabilities:{}})):u,chainId:y}}catch(p){const v=p;throw v.code===ne.code?new ne(v):v.code===so.code?new so(v):v}},async disconnect(){const d=await this.getProvider();i&&(d.removeListener("chainChanged",i),i=void 0),m&&(d.removeListener("disconnect",m),m=void 0),s||(s=this.onConnect.bind(this),d.on("connect",s)),await t.terminate()},async getAccounts(){return(await(await this.getProvider()).request({method:"eth_accounts"})).map(l=>ge(l))},async getChainId(){const d=await this.getProvider(),h=d.getChainId()||await d?.request({method:"eth_chainId"});return Number(h)},async getProvider(){async function d(){const h=await(async()=>{const{default:p}=await k(async()=>{const{default:v}=await import("./metamask-sdk-CYwNXe-E.js");return{default:v}},__vite__mapDeps([10,3,4]));return typeof p!="function"&&typeof p.default=="function"?p.default:p})(),l={};for(const p of g.chains)l[Ce(p.id)]=mr({chain:p,transports:g.transports})?.[0];t=new h({_source:"wagmi",forceDeleteProvider:!1,forceInjectProvider:!1,injectProvider:!1,...e,readonlyRPCMap:l,dappMetadata:{...e.dappMetadata,name:e.dappMetadata?.name?e.dappMetadata?.name:"wagmi",url:e.dappMetadata?.url?e.dappMetadata?.url:typeof window<"u"?window.location.origin:"https://wagmi.sh"},useDeeplink:e.useDeeplink??!0});const f=await t.init(),u=f?.activeProvider?f.activeProvider:t.getProvider();if(!u)throw new Be;return u}return n||(o||(o=d()),n=await o),n},async isAuthorized(){try{return!!(await io(()=>pr(()=>this.getAccounts(),{timeout:200}),{delay:201,retryCount:3})).length}catch{return!1}},async switchChain({addEthereumChainParameter:d,chainId:h}){const l=await this.getProvider(),f=g.chains.find(v=>v.id===h);if(!f)throw new Fe(new Et);try{return await l.request({method:"wallet_switchEthereumChain",params:[{chainId:Ce(h)}]}),await u(),await p(h),f}catch(v){const y=v;if(y.code===ne.code)throw new ne(y);if(y.code===4902||y?.data?.originalError?.code===4902)try{return await l.request({method:"wallet_addEthereumChain",params:[{blockExplorerUrls:(()=>{const{default:A,...E}=f.blockExplorers??{};if(d?.blockExplorerUrls)return d.blockExplorerUrls;if(A)return[A.url,...Object.values(E).map(C=>C.url)]})(),chainId:Ce(h),chainName:d?.chainName??f.name,iconUrls:d?.iconUrls,nativeCurrency:d?.nativeCurrency??f.nativeCurrency,rpcUrls:d?.rpcUrls?.length?d.rpcUrls:[f.rpcUrls.default?.http[0]??""]}]}),await u(),await p(h),f}catch(A){const E=A;throw E.code===ne.code?new ne(E):new Fe(E)}throw new Fe(y)}async function u(){await io(async()=>{const v=pi(await l.request({method:"eth_chainId"}));if(v!==h)throw new Error("User rejected switch after adding network.");return v},{delay:50,retryCount:20})}async function p(v){await new Promise(y=>{const A=(E=>{"chainId"in E&&E.chainId===v&&(g.emitter.off("change",A),y())});g.emitter.on("change",A),g.emitter.emit("change",{chainId:v})})}},async onAccountsChanged(d){if(d.length===0)if(t.isExtensionActive())this.onDisconnect();else return;else if(g.emitter.listenerCount("connect")){const h=(await this.getChainId()).toString();this.onConnect({chainId:h})}else g.emitter.emit("change",{accounts:d.map(h=>ge(h))})},onChainChanged(d){const h=Number(d);g.emitter.emit("change",{chainId:h})},async onConnect(d){const h=await this.getAccounts();if(h.length===0)return;const l=Number(d.chainId);g.emitter.emit("connect",{accounts:h,chainId:l});const f=await this.getProvider();s&&(f.removeListener("connect",s),s=void 0),r||(r=this.onAccountsChanged.bind(this),f.on("accountsChanged",r)),i||(i=this.onChainChanged.bind(this),f.on("chainChanged",i)),m||(m=this.onDisconnect.bind(this),f.on("disconnect",m))},async onDisconnect(d){const h=await this.getProvider();d&&d.code===1013&&h&&(await this.getAccounts()).length||(g.emitter.emit("disconnect"),i&&(h.removeListener("chainChanged",i),i=void 0),m&&(h.removeListener("disconnect",m),m=void 0),s||(s=this.onConnect.bind(this),h.on("connect",s)))},onDisplayUri(d){g.emitter.emit("message",{type:"display_uri",data:d})}}))}Dn.type="safe";function Dn(e={}){const{shimDisconnect:t=!1}=e;let n,o;return ye(r=>({id:"safe",name:"Safe",type:Dn.type,async connect({withCapabilities:i}={}){const s=await this.getProvider();if(!s)throw new Be;const c=await this.getAccounts(),m=await this.getChainId();return o||(o=this.onDisconnect.bind(this),s.on("disconnect",o)),t&&await r.storage?.removeItem("safe.disconnected"),{accounts:i?c.map(g=>({address:g,capabilities:{}})):c,chainId:m}},async disconnect(){const i=await this.getProvider();if(!i)throw new Be;o&&(i.removeListener("disconnect",o),o=void 0),t&&await r.storage?.setItem("safe.disconnected",!0)},async getAccounts(){const i=await this.getProvider();if(!i)throw new Be;return(await i.request({method:"eth_accounts"})).map(ge)},async getProvider(){if(typeof window<"u"&&window?.parent!==window){if(!n){const{default:s}=await k(async()=>{const{default:d}=await import("./index-oLWYEbgB.js");return{default:d}},__vite__mapDeps([11,12,2,3,4,1,5,6])),c=new s(e),m=await pr(()=>c.safe.getInfo(),{timeout:e.unstable_getInfoTimeout??10});if(!m)throw new Error("Could not load Safe information");const g=await(async()=>{const d=await k(()=>import("./index-Ce3IPH2_.js").then(h=>h.i),__vite__mapDeps([13,3,4,12,14,15]));return typeof d.SafeAppProvider!="function"&&typeof d.default.SafeAppProvider=="function"?d.default.SafeAppProvider:d.SafeAppProvider})();n=new g(m,c)}return n}},async getChainId(){const i=await this.getProvider();if(!i)throw new Be;return Number(i.chainId)},async isAuthorized(){try{return t&&await r.storage?.getItem("safe.disconnected")?!1:!!(await this.getAccounts()).length}catch{return!1}},onAccountsChanged(){},onChainChanged(){},onDisconnect(){r.emitter.emit("disconnect")}}))}Mn.type="walletConnect";function Mn(e){const t=e.isNewChainsStale??!0;let n,o;const r="eip155";let i,s,c,m,g,d;return ye(h=>({id:"walletConnect",name:"WalletConnect",type:Mn.type,async setup(){const l=await this.getProvider().catch(()=>null);l&&(c||(c=this.onConnect.bind(this),l.on("connect",c)),g||(g=this.onSessionDelete.bind(this),l.on("session_delete",g)))},async connect({chainId:l,withCapabilities:f,...u}={}){try{const p=await this.getProvider();if(!p)throw new Be;m||(m=this.onDisplayUri,p.on("display_uri",m));let v=l;if(!v){const C=await h.storage?.getItem("state")??{};h.chains.some(j=>j.id===C.chainId)?v=C.chainId:v=h.chains[0]?.id}if(!v)throw new Error("No chains found on connector.");const y=await this.isChainsStale();if(p.session&&y&&await p.disconnect(),!p.session||y){const C=h.chains.filter(x=>x.id!==v).map(x=>x.id);await p.connect({optionalChains:[v,...C],..."pairingTopic"in u?{pairingTopic:u.pairingTopic}:{}}),this.setRequestedChainsIds(h.chains.map(x=>x.id))}const A=(await p.enable()).map(C=>ge(C));let E=await this.getChainId();return l&&E!==l&&(E=(await this.switchChain({chainId:l}).catch(x=>{if(x.code===ne.code&&x.cause?.message!=="Missing or invalid. request() method: wallet_addEthereumChain")throw x;return{id:E}}))?.id??E),m&&(p.removeListener("display_uri",m),m=void 0),c&&(p.removeListener("connect",c),c=void 0),i||(i=this.onAccountsChanged.bind(this),p.on("accountsChanged",i)),s||(s=this.onChainChanged.bind(this),p.on("chainChanged",s)),d||(d=this.onDisconnect.bind(this),p.on("disconnect",d)),g||(g=this.onSessionDelete.bind(this),p.on("session_delete",g)),{accounts:f?A.map(C=>({address:C,capabilities:{}})):A,chainId:E}}catch(p){throw/(user rejected|connection request reset)/i.test(p?.message)?new ne(p):p}},async disconnect(){const l=await this.getProvider();try{await l?.disconnect()}catch(f){if(!/No matching key/i.test(f.message))throw f}finally{s&&(l?.removeListener("chainChanged",s),s=void 0),d&&(l?.removeListener("disconnect",d),d=void 0),c||(c=this.onConnect.bind(this),l?.on("connect",c)),i&&(l?.removeListener("accountsChanged",i),i=void 0),g&&(l?.removeListener("session_delete",g),g=void 0),this.setRequestedChainsIds([])}},async getAccounts(){return(await this.getProvider()).accounts.map(f=>ge(f))},async getProvider({chainId:l}={}){async function f(){const u=h.chains.map(v=>v.id);if(!u.length)return;const{EthereumProvider:p}=await k(async()=>{const{EthereumProvider:v}=await import("./index.es-CU6YW5cP.js").then(y=>y.W);return{EthereumProvider:v}},__vite__mapDeps([16,3,4,15,9]));return await p.init({...e,disableProviderPing:!0,optionalChains:u,projectId:e.projectId,rpcMap:Object.fromEntries(h.chains.map(v=>{const[y]=mr({chain:v,transports:h.transports});return[v.id,y]})),showQrModal:e.showQrModal??!0})}return n||(o||(o=f()),n=await o,n?.events.setMaxListeners(Number.POSITIVE_INFINITY)),l&&await this.switchChain?.({chainId:l}),n},async getChainId(){return(await this.getProvider()).chainId},async isAuthorized(){try{const[l,f]=await Promise.all([this.getAccounts(),this.getProvider()]);return l.length?await this.isChainsStale()&&f.session?(await f.disconnect().catch(()=>{}),!1):!0:!1}catch{return!1}},async switchChain({addEthereumChainParameter:l,chainId:f}){const u=await this.getProvider();if(!u)throw new Be;const p=h.chains.find(v=>v.id===f);if(!p)throw new Fe(new Et);try{await Promise.all([new Promise(y=>{const A=({chainId:E})=>{E===f&&(h.emitter.off("change",A),y())};h.emitter.on("change",A)}),u.request({method:"wallet_switchEthereumChain",params:[{chainId:Ce(f)}]})]);const v=await this.getRequestedChainsIds();return this.setRequestedChainsIds([...v,f]),p}catch(v){const y=v;if(/(user rejected)/i.test(y.message))throw new ne(y);try{let A;l?.blockExplorerUrls?A=l.blockExplorerUrls:A=p.blockExplorers?.default.url?[p.blockExplorers?.default.url]:[];let E;l?.rpcUrls?.length?E=l.rpcUrls:E=[...p.rpcUrls.default.http];const C={blockExplorerUrls:A,chainId:Ce(f),chainName:l?.chainName??p.name,iconUrls:l?.iconUrls,nativeCurrency:l?.nativeCurrency??p.nativeCurrency,rpcUrls:E};await u.request({method:"wallet_addEthereumChain",params:[C]});const x=await this.getRequestedChainsIds();return this.setRequestedChainsIds([...x,f]),p}catch(A){throw new ne(A)}}},onAccountsChanged(l){l.length===0?this.onDisconnect():h.emitter.emit("change",{accounts:l.map(f=>ge(f))})},onChainChanged(l){const f=Number(l);h.emitter.emit("change",{chainId:f})},async onConnect(l){const f=Number(l.chainId),u=await this.getAccounts();h.emitter.emit("connect",{accounts:u,chainId:f})},async onDisconnect(l){this.setRequestedChainsIds([]),h.emitter.emit("disconnect");const f=await this.getProvider();i&&(f.removeListener("accountsChanged",i),i=void 0),s&&(f.removeListener("chainChanged",s),s=void 0),d&&(f.removeListener("disconnect",d),d=void 0),g&&(f.removeListener("session_delete",g),g=void 0),c||(c=this.onConnect.bind(this),f.on("connect",c))},onDisplayUri(l){h.emitter.emit("message",{type:"display_uri",data:l})},onSessionDelete(){this.onDisconnect()},getNamespaceChainsIds(){return n?n.session?.namespaces[r]?.accounts?.map(f=>Number.parseInt(f.split(":")[1]||"",10))??[]:[]},async getRequestedChainsIds(){return await h.storage?.getItem(this.requestedChainsStorageKey)??[]},async isChainsStale(){if(!t)return!1;const l=h.chains.map(p=>p.id),f=this.getNamespaceChainsIds();if(f.length&&!f.some(p=>l.includes(p)))return!1;const u=await this.getRequestedChainsIds();return!l.every(p=>u.includes(p))},async setRequestedChainsIds(l){await h.storage?.setItem(this.requestedChainsStorageKey,l)},get requestedChainsStorageKey(){return`${this.id}.requestedChains`}}))}var Tt={},Rl=768,Oe=Si({conditions:{defaultCondition:"smallScreen",conditionNames:["smallScreen","largeScreen"],responsiveArray:void 0}}),Zr=Ar({conditions:{defaultCondition:"smallScreen",conditionNames:["smallScreen","largeScreen"],responsiveArray:void 0}}),Cn=Li({conditions:{defaultCondition:"base",conditionNames:["base","hover","active"],responsiveArray:void 0},styles:{background:{values:{accentColor:{conditions:{base:"ju367v9i",hover:"ju367v9j",active:"ju367v9k"},defaultClass:"ju367v9i"},accentColorForeground:{conditions:{base:"ju367v9l",hover:"ju367v9m",active:"ju367v9n"},defaultClass:"ju367v9l"},actionButtonBorder:{conditions:{base:"ju367v9o",hover:"ju367v9p",active:"ju367v9q"},defaultClass:"ju367v9o"},actionButtonBorderMobile:{conditions:{base:"ju367v9r",hover:"ju367v9s",active:"ju367v9t"},defaultClass:"ju367v9r"},actionButtonSecondaryBackground:{conditions:{base:"ju367v9u",hover:"ju367v9v",active:"ju367v9w"},defaultClass:"ju367v9u"},closeButton:{conditions:{base:"ju367v9x",hover:"ju367v9y",active:"ju367v9z"},defaultClass:"ju367v9x"},closeButtonBackground:{conditions:{base:"ju367va0",hover:"ju367va1",active:"ju367va2"},defaultClass:"ju367va0"},connectButtonBackground:{conditions:{base:"ju367va3",hover:"ju367va4",active:"ju367va5"},defaultClass:"ju367va3"},connectButtonBackgroundError:{conditions:{base:"ju367va6",hover:"ju367va7",active:"ju367va8"},defaultClass:"ju367va6"},connectButtonInnerBackground:{conditions:{base:"ju367va9",hover:"ju367vaa",active:"ju367vab"},defaultClass:"ju367va9"},connectButtonText:{conditions:{base:"ju367vac",hover:"ju367vad",active:"ju367vae"},defaultClass:"ju367vac"},connectButtonTextError:{conditions:{base:"ju367vaf",hover:"ju367vag",active:"ju367vah"},defaultClass:"ju367vaf"},connectionIndicator:{conditions:{base:"ju367vai",hover:"ju367vaj",active:"ju367vak"},defaultClass:"ju367vai"},downloadBottomCardBackground:{conditions:{base:"ju367val",hover:"ju367vam",active:"ju367van"},defaultClass:"ju367val"},downloadTopCardBackground:{conditions:{base:"ju367vao",hover:"ju367vap",active:"ju367vaq"},defaultClass:"ju367vao"},error:{conditions:{base:"ju367var",hover:"ju367vas",active:"ju367vat"},defaultClass:"ju367var"},generalBorder:{conditions:{base:"ju367vau",hover:"ju367vav",active:"ju367vaw"},defaultClass:"ju367vau"},generalBorderDim:{conditions:{base:"ju367vax",hover:"ju367vay",active:"ju367vaz"},defaultClass:"ju367vax"},menuItemBackground:{conditions:{base:"ju367vb0",hover:"ju367vb1",active:"ju367vb2"},defaultClass:"ju367vb0"},modalBackdrop:{conditions:{base:"ju367vb3",hover:"ju367vb4",active:"ju367vb5"},defaultClass:"ju367vb3"},modalBackground:{conditions:{base:"ju367vb6",hover:"ju367vb7",active:"ju367vb8"},defaultClass:"ju367vb6"},modalBorder:{conditions:{base:"ju367vb9",hover:"ju367vba",active:"ju367vbb"},defaultClass:"ju367vb9"},modalText:{conditions:{base:"ju367vbc",hover:"ju367vbd",active:"ju367vbe"},defaultClass:"ju367vbc"},modalTextDim:{conditions:{base:"ju367vbf",hover:"ju367vbg",active:"ju367vbh"},defaultClass:"ju367vbf"},modalTextSecondary:{conditions:{base:"ju367vbi",hover:"ju367vbj",active:"ju367vbk"},defaultClass:"ju367vbi"},profileAction:{conditions:{base:"ju367vbl",hover:"ju367vbm",active:"ju367vbn"},defaultClass:"ju367vbl"},profileActionHover:{conditions:{base:"ju367vbo",hover:"ju367vbp",active:"ju367vbq"},defaultClass:"ju367vbo"},profileForeground:{conditions:{base:"ju367vbr",hover:"ju367vbs",active:"ju367vbt"},defaultClass:"ju367vbr"},selectedOptionBorder:{conditions:{base:"ju367vbu",hover:"ju367vbv",active:"ju367vbw"},defaultClass:"ju367vbu"},standby:{conditions:{base:"ju367vbx",hover:"ju367vby",active:"ju367vbz"},defaultClass:"ju367vbx"}}},borderColor:{values:{accentColor:{conditions:{base:"ju367vc0",hover:"ju367vc1",active:"ju367vc2"},defaultClass:"ju367vc0"},accentColorForeground:{conditions:{base:"ju367vc3",hover:"ju367vc4",active:"ju367vc5"},defaultClass:"ju367vc3"},actionButtonBorder:{conditions:{base:"ju367vc6",hover:"ju367vc7",active:"ju367vc8"},defaultClass:"ju367vc6"},actionButtonBorderMobile:{conditions:{base:"ju367vc9",hover:"ju367vca",active:"ju367vcb"},defaultClass:"ju367vc9"},actionButtonSecondaryBackground:{conditions:{base:"ju367vcc",hover:"ju367vcd",active:"ju367vce"},defaultClass:"ju367vcc"},closeButton:{conditions:{base:"ju367vcf",hover:"ju367vcg",active:"ju367vch"},defaultClass:"ju367vcf"},closeButtonBackground:{conditions:{base:"ju367vci",hover:"ju367vcj",active:"ju367vck"},defaultClass:"ju367vci"},connectButtonBackground:{conditions:{base:"ju367vcl",hover:"ju367vcm",active:"ju367vcn"},defaultClass:"ju367vcl"},connectButtonBackgroundError:{conditions:{base:"ju367vco",hover:"ju367vcp",active:"ju367vcq"},defaultClass:"ju367vco"},connectButtonInnerBackground:{conditions:{base:"ju367vcr",hover:"ju367vcs",active:"ju367vct"},defaultClass:"ju367vcr"},connectButtonText:{conditions:{base:"ju367vcu",hover:"ju367vcv",active:"ju367vcw"},defaultClass:"ju367vcu"},connectButtonTextError:{conditions:{base:"ju367vcx",hover:"ju367vcy",active:"ju367vcz"},defaultClass:"ju367vcx"},connectionIndicator:{conditions:{base:"ju367vd0",hover:"ju367vd1",active:"ju367vd2"},defaultClass:"ju367vd0"},downloadBottomCardBackground:{conditions:{base:"ju367vd3",hover:"ju367vd4",active:"ju367vd5"},defaultClass:"ju367vd3"},downloadTopCardBackground:{conditions:{base:"ju367vd6",hover:"ju367vd7",active:"ju367vd8"},defaultClass:"ju367vd6"},error:{conditions:{base:"ju367vd9",hover:"ju367vda",active:"ju367vdb"},defaultClass:"ju367vd9"},generalBorder:{conditions:{base:"ju367vdc",hover:"ju367vdd",active:"ju367vde"},defaultClass:"ju367vdc"},generalBorderDim:{conditions:{base:"ju367vdf",hover:"ju367vdg",active:"ju367vdh"},defaultClass:"ju367vdf"},menuItemBackground:{conditions:{base:"ju367vdi",hover:"ju367vdj",active:"ju367vdk"},defaultClass:"ju367vdi"},modalBackdrop:{conditions:{base:"ju367vdl",hover:"ju367vdm",active:"ju367vdn"},defaultClass:"ju367vdl"},modalBackground:{conditions:{base:"ju367vdo",hover:"ju367vdp",active:"ju367vdq"},defaultClass:"ju367vdo"},modalBorder:{conditions:{base:"ju367vdr",hover:"ju367vds",active:"ju367vdt"},defaultClass:"ju367vdr"},modalText:{conditions:{base:"ju367vdu",hover:"ju367vdv",active:"ju367vdw"},defaultClass:"ju367vdu"},modalTextDim:{conditions:{base:"ju367vdx",hover:"ju367vdy",active:"ju367vdz"},defaultClass:"ju367vdx"},modalTextSecondary:{conditions:{base:"ju367ve0",hover:"ju367ve1",active:"ju367ve2"},defaultClass:"ju367ve0"},profileAction:{conditions:{base:"ju367ve3",hover:"ju367ve4",active:"ju367ve5"},defaultClass:"ju367ve3"},profileActionHover:{conditions:{base:"ju367ve6",hover:"ju367ve7",active:"ju367ve8"},defaultClass:"ju367ve6"},profileForeground:{conditions:{base:"ju367ve9",hover:"ju367vea",active:"ju367veb"},defaultClass:"ju367ve9"},selectedOptionBorder:{conditions:{base:"ju367vec",hover:"ju367ved",active:"ju367vee"},defaultClass:"ju367vec"},standby:{conditions:{base:"ju367vef",hover:"ju367veg",active:"ju367veh"},defaultClass:"ju367vef"}}},boxShadow:{values:{connectButton:{conditions:{base:"ju367vei",hover:"ju367vej",active:"ju367vek"},defaultClass:"ju367vei"},dialog:{conditions:{base:"ju367vel",hover:"ju367vem",active:"ju367ven"},defaultClass:"ju367vel"},profileDetailsAction:{conditions:{base:"ju367veo",hover:"ju367vep",active:"ju367veq"},defaultClass:"ju367veo"},selectedOption:{conditions:{base:"ju367ver",hover:"ju367ves",active:"ju367vet"},defaultClass:"ju367ver"},selectedWallet:{conditions:{base:"ju367veu",hover:"ju367vev",active:"ju367vew"},defaultClass:"ju367veu"},walletLogo:{conditions:{base:"ju367vex",hover:"ju367vey",active:"ju367vez"},defaultClass:"ju367vex"}}},color:{values:{accentColor:{conditions:{base:"ju367vf0",hover:"ju367vf1",active:"ju367vf2"},defaultClass:"ju367vf0"},accentColorForeground:{conditions:{base:"ju367vf3",hover:"ju367vf4",active:"ju367vf5"},defaultClass:"ju367vf3"},actionButtonBorder:{conditions:{base:"ju367vf6",hover:"ju367vf7",active:"ju367vf8"},defaultClass:"ju367vf6"},actionButtonBorderMobile:{conditions:{base:"ju367vf9",hover:"ju367vfa",active:"ju367vfb"},defaultClass:"ju367vf9"},actionButtonSecondaryBackground:{conditions:{base:"ju367vfc",hover:"ju367vfd",active:"ju367vfe"},defaultClass:"ju367vfc"},closeButton:{conditions:{base:"ju367vff",hover:"ju367vfg",active:"ju367vfh"},defaultClass:"ju367vff"},closeButtonBackground:{conditions:{base:"ju367vfi",hover:"ju367vfj",active:"ju367vfk"},defaultClass:"ju367vfi"},connectButtonBackground:{conditions:{base:"ju367vfl",hover:"ju367vfm",active:"ju367vfn"},defaultClass:"ju367vfl"},connectButtonBackgroundError:{conditions:{base:"ju367vfo",hover:"ju367vfp",active:"ju367vfq"},defaultClass:"ju367vfo"},connectButtonInnerBackground:{conditions:{base:"ju367vfr",hover:"ju367vfs",active:"ju367vft"},defaultClass:"ju367vfr"},connectButtonText:{conditions:{base:"ju367vfu",hover:"ju367vfv",active:"ju367vfw"},defaultClass:"ju367vfu"},connectButtonTextError:{conditions:{base:"ju367vfx",hover:"ju367vfy",active:"ju367vfz"},defaultClass:"ju367vfx"},connectionIndicator:{conditions:{base:"ju367vg0",hover:"ju367vg1",active:"ju367vg2"},defaultClass:"ju367vg0"},downloadBottomCardBackground:{conditions:{base:"ju367vg3",hover:"ju367vg4",active:"ju367vg5"},defaultClass:"ju367vg3"},downloadTopCardBackground:{conditions:{base:"ju367vg6",hover:"ju367vg7",active:"ju367vg8"},defaultClass:"ju367vg6"},error:{conditions:{base:"ju367vg9",hover:"ju367vga",active:"ju367vgb"},defaultClass:"ju367vg9"},generalBorder:{conditions:{base:"ju367vgc",hover:"ju367vgd",active:"ju367vge"},defaultClass:"ju367vgc"},generalBorderDim:{conditions:{base:"ju367vgf",hover:"ju367vgg",active:"ju367vgh"},defaultClass:"ju367vgf"},menuItemBackground:{conditions:{base:"ju367vgi",hover:"ju367vgj",active:"ju367vgk"},defaultClass:"ju367vgi"},modalBackdrop:{conditions:{base:"ju367vgl",hover:"ju367vgm",active:"ju367vgn"},defaultClass:"ju367vgl"},modalBackground:{conditions:{base:"ju367vgo",hover:"ju367vgp",active:"ju367vgq"},defaultClass:"ju367vgo"},modalBorder:{conditions:{base:"ju367vgr",hover:"ju367vgs",active:"ju367vgt"},defaultClass:"ju367vgr"},modalText:{conditions:{base:"ju367vgu",hover:"ju367vgv",active:"ju367vgw"},defaultClass:"ju367vgu"},modalTextDim:{conditions:{base:"ju367vgx",hover:"ju367vgy",active:"ju367vgz"},defaultClass:"ju367vgx"},modalTextSecondary:{conditions:{base:"ju367vh0",hover:"ju367vh1",active:"ju367vh2"},defaultClass:"ju367vh0"},profileAction:{conditions:{base:"ju367vh3",hover:"ju367vh4",active:"ju367vh5"},defaultClass:"ju367vh3"},profileActionHover:{conditions:{base:"ju367vh6",hover:"ju367vh7",active:"ju367vh8"},defaultClass:"ju367vh6"},profileForeground:{conditions:{base:"ju367vh9",hover:"ju367vha",active:"ju367vhb"},defaultClass:"ju367vh9"},selectedOptionBorder:{conditions:{base:"ju367vhc",hover:"ju367vhd",active:"ju367vhe"},defaultClass:"ju367vhc"},standby:{conditions:{base:"ju367vhf",hover:"ju367vhg",active:"ju367vhh"},defaultClass:"ju367vhf"}}}}},{conditions:{defaultCondition:"smallScreen",conditionNames:["smallScreen","largeScreen"],responsiveArray:void 0},styles:{alignItems:{values:{"flex-start":{conditions:{smallScreen:"ju367v0",largeScreen:"ju367v1"},defaultClass:"ju367v0"},"flex-end":{conditions:{smallScreen:"ju367v2",largeScreen:"ju367v3"},defaultClass:"ju367v2"},center:{conditions:{smallScreen:"ju367v4",largeScreen:"ju367v5"},defaultClass:"ju367v4"}}},display:{values:{none:{conditions:{smallScreen:"ju367v6",largeScreen:"ju367v7"},defaultClass:"ju367v6"},block:{conditions:{smallScreen:"ju367v8",largeScreen:"ju367v9"},defaultClass:"ju367v8"},flex:{conditions:{smallScreen:"ju367va",largeScreen:"ju367vb"},defaultClass:"ju367va"},inline:{conditions:{smallScreen:"ju367vc",largeScreen:"ju367vd"},defaultClass:"ju367vc"}}}}},{conditions:void 0,styles:{margin:{mappings:["marginTop","marginBottom","marginLeft","marginRight"]},marginX:{mappings:["marginLeft","marginRight"]},marginY:{mappings:["marginTop","marginBottom"]},padding:{mappings:["paddingTop","paddingBottom","paddingLeft","paddingRight"]},paddingX:{mappings:["paddingLeft","paddingRight"]},paddingY:{mappings:["paddingTop","paddingBottom"]},alignSelf:{values:{"flex-start":{defaultClass:"ju367ve"},"flex-end":{defaultClass:"ju367vf"},center:{defaultClass:"ju367vg"}}},backgroundSize:{values:{cover:{defaultClass:"ju367vh"}}},borderRadius:{values:{1:{defaultClass:"ju367vi"},6:{defaultClass:"ju367vj"},10:{defaultClass:"ju367vk"},13:{defaultClass:"ju367vl"},actionButton:{defaultClass:"ju367vm"},connectButton:{defaultClass:"ju367vn"},menuButton:{defaultClass:"ju367vo"},modal:{defaultClass:"ju367vp"},modalMobile:{defaultClass:"ju367vq"},"25%":{defaultClass:"ju367vr"},full:{defaultClass:"ju367vs"}}},borderStyle:{values:{solid:{defaultClass:"ju367vt"}}},borderWidth:{values:{0:{defaultClass:"ju367vu"},1:{defaultClass:"ju367vv"},2:{defaultClass:"ju367vw"},4:{defaultClass:"ju367vx"}}},cursor:{values:{pointer:{defaultClass:"ju367vy"},none:{defaultClass:"ju367vz"}}},pointerEvents:{values:{none:{defaultClass:"ju367v10"},all:{defaultClass:"ju367v11"}}},minHeight:{values:{8:{defaultClass:"ju367v12"},44:{defaultClass:"ju367v13"}}},flexDirection:{values:{row:{defaultClass:"ju367v14"},column:{defaultClass:"ju367v15"}}},fontFamily:{values:{body:{defaultClass:"ju367v16"}}},fontSize:{values:{12:{defaultClass:"ju367v17"},13:{defaultClass:"ju367v18"},14:{defaultClass:"ju367v19"},16:{defaultClass:"ju367v1a"},18:{defaultClass:"ju367v1b"},20:{defaultClass:"ju367v1c"},23:{defaultClass:"ju367v1d"}}},fontWeight:{values:{regular:{defaultClass:"ju367v1e"},medium:{defaultClass:"ju367v1f"},semibold:{defaultClass:"ju367v1g"},bold:{defaultClass:"ju367v1h"},heavy:{defaultClass:"ju367v1i"}}},gap:{values:{0:{defaultClass:"ju367v1j"},1:{defaultClass:"ju367v1k"},2:{defaultClass:"ju367v1l"},3:{defaultClass:"ju367v1m"},4:{defaultClass:"ju367v1n"},5:{defaultClass:"ju367v1o"},6:{defaultClass:"ju367v1p"},8:{defaultClass:"ju367v1q"},10:{defaultClass:"ju367v1r"},12:{defaultClass:"ju367v1s"},14:{defaultClass:"ju367v1t"},16:{defaultClass:"ju367v1u"},18:{defaultClass:"ju367v1v"},20:{defaultClass:"ju367v1w"},24:{defaultClass:"ju367v1x"},28:{defaultClass:"ju367v1y"},32:{defaultClass:"ju367v1z"},36:{defaultClass:"ju367v20"},44:{defaultClass:"ju367v21"},64:{defaultClass:"ju367v22"},"-1":{defaultClass:"ju367v23"}}},height:{values:{1:{defaultClass:"ju367v24"},2:{defaultClass:"ju367v25"},4:{defaultClass:"ju367v26"},8:{defaultClass:"ju367v27"},12:{defaultClass:"ju367v28"},20:{defaultClass:"ju367v29"},24:{defaultClass:"ju367v2a"},28:{defaultClass:"ju367v2b"},30:{defaultClass:"ju367v2c"},32:{defaultClass:"ju367v2d"},34:{defaultClass:"ju367v2e"},36:{defaultClass:"ju367v2f"},40:{defaultClass:"ju367v2g"},44:{defaultClass:"ju367v2h"},48:{defaultClass:"ju367v2i"},54:{defaultClass:"ju367v2j"},60:{defaultClass:"ju367v2k"},200:{defaultClass:"ju367v2l"},full:{defaultClass:"ju367v2m"},max:{defaultClass:"ju367v2n"}}},justifyContent:{values:{"flex-start":{defaultClass:"ju367v2o"},"flex-end":{defaultClass:"ju367v2p"},center:{defaultClass:"ju367v2q"},"space-between":{defaultClass:"ju367v2r"},"space-around":{defaultClass:"ju367v2s"}}},textAlign:{values:{left:{defaultClass:"ju367v2t"},center:{defaultClass:"ju367v2u"},inherit:{defaultClass:"ju367v2v"}}},marginBottom:{values:{0:{defaultClass:"ju367v2w"},1:{defaultClass:"ju367v2x"},2:{defaultClass:"ju367v2y"},3:{defaultClass:"ju367v2z"},4:{defaultClass:"ju367v30"},5:{defaultClass:"ju367v31"},6:{defaultClass:"ju367v32"},8:{defaultClass:"ju367v33"},10:{defaultClass:"ju367v34"},12:{defaultClass:"ju367v35"},14:{defaultClass:"ju367v36"},16:{defaultClass:"ju367v37"},18:{defaultClass:"ju367v38"},20:{defaultClass:"ju367v39"},24:{defaultClass:"ju367v3a"},28:{defaultClass:"ju367v3b"},32:{defaultClass:"ju367v3c"},36:{defaultClass:"ju367v3d"},44:{defaultClass:"ju367v3e"},64:{defaultClass:"ju367v3f"},"-1":{defaultClass:"ju367v3g"}}},marginLeft:{values:{0:{defaultClass:"ju367v3h"},1:{defaultClass:"ju367v3i"},2:{defaultClass:"ju367v3j"},3:{defaultClass:"ju367v3k"},4:{defaultClass:"ju367v3l"},5:{defaultClass:"ju367v3m"},6:{defaultClass:"ju367v3n"},8:{defaultClass:"ju367v3o"},10:{defaultClass:"ju367v3p"},12:{defaultClass:"ju367v3q"},14:{defaultClass:"ju367v3r"},16:{defaultClass:"ju367v3s"},18:{defaultClass:"ju367v3t"},20:{defaultClass:"ju367v3u"},24:{defaultClass:"ju367v3v"},28:{defaultClass:"ju367v3w"},32:{defaultClass:"ju367v3x"},36:{defaultClass:"ju367v3y"},44:{defaultClass:"ju367v3z"},64:{defaultClass:"ju367v40"},"-1":{defaultClass:"ju367v41"}}},marginRight:{values:{0:{defaultClass:"ju367v42"},1:{defaultClass:"ju367v43"},2:{defaultClass:"ju367v44"},3:{defaultClass:"ju367v45"},4:{defaultClass:"ju367v46"},5:{defaultClass:"ju367v47"},6:{defaultClass:"ju367v48"},8:{defaultClass:"ju367v49"},10:{defaultClass:"ju367v4a"},12:{defaultClass:"ju367v4b"},14:{defaultClass:"ju367v4c"},16:{defaultClass:"ju367v4d"},18:{defaultClass:"ju367v4e"},20:{defaultClass:"ju367v4f"},24:{defaultClass:"ju367v4g"},28:{defaultClass:"ju367v4h"},32:{defaultClass:"ju367v4i"},36:{defaultClass:"ju367v4j"},44:{defaultClass:"ju367v4k"},64:{defaultClass:"ju367v4l"},"-1":{defaultClass:"ju367v4m"}}},marginTop:{values:{0:{defaultClass:"ju367v4n"},1:{defaultClass:"ju367v4o"},2:{defaultClass:"ju367v4p"},3:{defaultClass:"ju367v4q"},4:{defaultClass:"ju367v4r"},5:{defaultClass:"ju367v4s"},6:{defaultClass:"ju367v4t"},8:{defaultClass:"ju367v4u"},10:{defaultClass:"ju367v4v"},12:{defaultClass:"ju367v4w"},14:{defaultClass:"ju367v4x"},16:{defaultClass:"ju367v4y"},18:{defaultClass:"ju367v4z"},20:{defaultClass:"ju367v50"},24:{defaultClass:"ju367v51"},28:{defaultClass:"ju367v52"},32:{defaultClass:"ju367v53"},36:{defaultClass:"ju367v54"},44:{defaultClass:"ju367v55"},64:{defaultClass:"ju367v56"},"-1":{defaultClass:"ju367v57"}}},maxWidth:{values:{1:{defaultClass:"ju367v58"},2:{defaultClass:"ju367v59"},4:{defaultClass:"ju367v5a"},8:{defaultClass:"ju367v5b"},12:{defaultClass:"ju367v5c"},20:{defaultClass:"ju367v5d"},24:{defaultClass:"ju367v5e"},28:{defaultClass:"ju367v5f"},30:{defaultClass:"ju367v5g"},32:{defaultClass:"ju367v5h"},34:{defaultClass:"ju367v5i"},36:{defaultClass:"ju367v5j"},40:{defaultClass:"ju367v5k"},44:{defaultClass:"ju367v5l"},48:{defaultClass:"ju367v5m"},54:{defaultClass:"ju367v5n"},60:{defaultClass:"ju367v5o"},200:{defaultClass:"ju367v5p"},full:{defaultClass:"ju367v5q"},max:{defaultClass:"ju367v5r"}}},minWidth:{values:{1:{defaultClass:"ju367v5s"},2:{defaultClass:"ju367v5t"},4:{defaultClass:"ju367v5u"},8:{defaultClass:"ju367v5v"},12:{defaultClass:"ju367v5w"},20:{defaultClass:"ju367v5x"},24:{defaultClass:"ju367v5y"},28:{defaultClass:"ju367v5z"},30:{defaultClass:"ju367v60"},32:{defaultClass:"ju367v61"},34:{defaultClass:"ju367v62"},36:{defaultClass:"ju367v63"},40:{defaultClass:"ju367v64"},44:{defaultClass:"ju367v65"},48:{defaultClass:"ju367v66"},54:{defaultClass:"ju367v67"},60:{defaultClass:"ju367v68"},200:{defaultClass:"ju367v69"},full:{defaultClass:"ju367v6a"},max:{defaultClass:"ju367v6b"}}},overflow:{values:{hidden:{defaultClass:"ju367v6c"}}},paddingBottom:{values:{0:{defaultClass:"ju367v6d"},1:{defaultClass:"ju367v6e"},2:{defaultClass:"ju367v6f"},3:{defaultClass:"ju367v6g"},4:{defaultClass:"ju367v6h"},5:{defaultClass:"ju367v6i"},6:{defaultClass:"ju367v6j"},8:{defaultClass:"ju367v6k"},10:{defaultClass:"ju367v6l"},12:{defaultClass:"ju367v6m"},14:{defaultClass:"ju367v6n"},16:{defaultClass:"ju367v6o"},18:{defaultClass:"ju367v6p"},20:{defaultClass:"ju367v6q"},24:{defaultClass:"ju367v6r"},28:{defaultClass:"ju367v6s"},32:{defaultClass:"ju367v6t"},36:{defaultClass:"ju367v6u"},44:{defaultClass:"ju367v6v"},64:{defaultClass:"ju367v6w"},"-1":{defaultClass:"ju367v6x"}}},paddingLeft:{values:{0:{defaultClass:"ju367v6y"},1:{defaultClass:"ju367v6z"},2:{defaultClass:"ju367v70"},3:{defaultClass:"ju367v71"},4:{defaultClass:"ju367v72"},5:{defaultClass:"ju367v73"},6:{defaultClass:"ju367v74"},8:{defaultClass:"ju367v75"},10:{defaultClass:"ju367v76"},12:{defaultClass:"ju367v77"},14:{defaultClass:"ju367v78"},16:{defaultClass:"ju367v79"},18:{defaultClass:"ju367v7a"},20:{defaultClass:"ju367v7b"},24:{defaultClass:"ju367v7c"},28:{defaultClass:"ju367v7d"},32:{defaultClass:"ju367v7e"},36:{defaultClass:"ju367v7f"},44:{defaultClass:"ju367v7g"},64:{defaultClass:"ju367v7h"},"-1":{defaultClass:"ju367v7i"}}},paddingRight:{values:{0:{defaultClass:"ju367v7j"},1:{defaultClass:"ju367v7k"},2:{defaultClass:"ju367v7l"},3:{defaultClass:"ju367v7m"},4:{defaultClass:"ju367v7n"},5:{defaultClass:"ju367v7o"},6:{defaultClass:"ju367v7p"},8:{defaultClass:"ju367v7q"},10:{defaultClass:"ju367v7r"},12:{defaultClass:"ju367v7s"},14:{defaultClass:"ju367v7t"},16:{defaultClass:"ju367v7u"},18:{defaultClass:"ju367v7v"},20:{defaultClass:"ju367v7w"},24:{defaultClass:"ju367v7x"},28:{defaultClass:"ju367v7y"},32:{defaultClass:"ju367v7z"},36:{defaultClass:"ju367v80"},44:{defaultClass:"ju367v81"},64:{defaultClass:"ju367v82"},"-1":{defaultClass:"ju367v83"}}},paddingTop:{values:{0:{defaultClass:"ju367v84"},1:{defaultClass:"ju367v85"},2:{defaultClass:"ju367v86"},3:{defaultClass:"ju367v87"},4:{defaultClass:"ju367v88"},5:{defaultClass:"ju367v89"},6:{defaultClass:"ju367v8a"},8:{defaultClass:"ju367v8b"},10:{defaultClass:"ju367v8c"},12:{defaultClass:"ju367v8d"},14:{defaultClass:"ju367v8e"},16:{defaultClass:"ju367v8f"},18:{defaultClass:"ju367v8g"},20:{defaultClass:"ju367v8h"},24:{defaultClass:"ju367v8i"},28:{defaultClass:"ju367v8j"},32:{defaultClass:"ju367v8k"},36:{defaultClass:"ju367v8l"},44:{defaultClass:"ju367v8m"},64:{defaultClass:"ju367v8n"},"-1":{defaultClass:"ju367v8o"}}},position:{values:{absolute:{defaultClass:"ju367v8p"},fixed:{defaultClass:"ju367v8q"},relative:{defaultClass:"ju367v8r"}}},WebkitUserSelect:{values:{none:{defaultClass:"ju367v8s"}}},right:{values:{0:{defaultClass:"ju367v8t"}}},transition:{values:{default:{defaultClass:"ju367v8u"},transform:{defaultClass:"ju367v8v"}}},userSelect:{values:{none:{defaultClass:"ju367v8w"}}},width:{values:{1:{defaultClass:"ju367v8x"},2:{defaultClass:"ju367v8y"},4:{defaultClass:"ju367v8z"},8:{defaultClass:"ju367v90"},12:{defaultClass:"ju367v91"},20:{defaultClass:"ju367v92"},24:{defaultClass:"ju367v93"},28:{defaultClass:"ju367v94"},30:{defaultClass:"ju367v95"},32:{defaultClass:"ju367v96"},34:{defaultClass:"ju367v97"},36:{defaultClass:"ju367v98"},40:{defaultClass:"ju367v99"},44:{defaultClass:"ju367v9a"},48:{defaultClass:"ju367v9b"},54:{defaultClass:"ju367v9c"},60:{defaultClass:"ju367v9d"},200:{defaultClass:"ju367v9e"},full:{defaultClass:"ju367v9f"},max:{defaultClass:"ju367v9g"}}},backdropFilter:{values:{modalOverlay:{defaultClass:"ju367v9h"}}}}}),Ro={colors:{accentColor:"var(--rk-colors-accentColor)",accentColorForeground:"var(--rk-colors-accentColorForeground)",actionButtonBorder:"var(--rk-colors-actionButtonBorder)",actionButtonBorderMobile:"var(--rk-colors-actionButtonBorderMobile)",actionButtonSecondaryBackground:"var(--rk-colors-actionButtonSecondaryBackground)",closeButton:"var(--rk-colors-closeButton)",closeButtonBackground:"var(--rk-colors-closeButtonBackground)",connectButtonBackground:"var(--rk-colors-connectButtonBackground)",connectButtonBackgroundError:"var(--rk-colors-connectButtonBackgroundError)",connectButtonInnerBackground:"var(--rk-colors-connectButtonInnerBackground)",connectButtonText:"var(--rk-colors-connectButtonText)",connectButtonTextError:"var(--rk-colors-connectButtonTextError)",connectionIndicator:"var(--rk-colors-connectionIndicator)",downloadBottomCardBackground:"var(--rk-colors-downloadBottomCardBackground)",downloadTopCardBackground:"var(--rk-colors-downloadTopCardBackground)",error:"var(--rk-colors-error)",generalBorder:"var(--rk-colors-generalBorder)",generalBorderDim:"var(--rk-colors-generalBorderDim)",menuItemBackground:"var(--rk-colors-menuItemBackground)",modalBackdrop:"var(--rk-colors-modalBackdrop)",modalBackground:"var(--rk-colors-modalBackground)",modalBorder:"var(--rk-colors-modalBorder)",modalText:"var(--rk-colors-modalText)",modalTextDim:"var(--rk-colors-modalTextDim)",modalTextSecondary:"var(--rk-colors-modalTextSecondary)",profileAction:"var(--rk-colors-profileAction)",profileActionHover:"var(--rk-colors-profileActionHover)",profileForeground:"var(--rk-colors-profileForeground)",selectedOptionBorder:"var(--rk-colors-selectedOptionBorder)",standby:"var(--rk-colors-standby)"},fonts:{body:"var(--rk-fonts-body)"},radii:{actionButton:"var(--rk-radii-actionButton)",connectButton:"var(--rk-radii-connectButton)",menuButton:"var(--rk-radii-menuButton)",modal:"var(--rk-radii-modal)",modalMobile:"var(--rk-radii-modalMobile)"},shadows:{connectButton:"var(--rk-shadows-connectButton)",dialog:"var(--rk-shadows-dialog)",profileDetailsAction:"var(--rk-shadows-profileDetailsAction)",selectedOption:"var(--rk-shadows-selectedOption)",selectedWallet:"var(--rk-shadows-selectedWallet)",walletLogo:"var(--rk-shadows-walletLogo)"},blurs:{modalOverlay:"var(--rk-blurs-modalOverlay)"}},Ol={shrink:"_12cbo8i6",shrinkSm:"_12cbo8i7"},Ll="_12cbo8i3 ju367v8r",Fl={grow:"_12cbo8i4",growLg:"_12cbo8i5"};function V({active:e,hover:t}){return[Ll,t&&Fl[t],Ol[e]]}function Nl(e){return e}var Rn=b.createContext(null);function Wl({adapter:e,children:t,enabled:n=!0,status:o}){const{connector:r}=$(),[i,s]=b.useState();Ot({onDisconnect:()=>{e.signOut(),s(void 0)}});const c=m=>{m.accounts&&(s(void 0),e.signOut())};return b.useEffect(()=>{if(typeof r?.emitter?.on=="function"&&o==="authenticated")return s(r?.uid),r.emitter.on("change",c),()=>{r.emitter.off("change",c)}},[r?.emitter,o]),b.useEffect(()=>{i&&typeof r?.emitter?.on=="function"&&o==="authenticated"&&r?.uid!==i&&(s(void 0),e.signOut())},[r?.emitter,i,o]),a.createElement(Rn.Provider,{value:b.useMemo(()=>n?{adapter:e,status:o}:null,[n,e,o])},t)}function Pl(){const{adapter:e}=b.useContext(Rn)??{};if(!e)throw new Error("No authentication adapter found");return e}function Nt(){return b.useContext(Rn)?.status??null}function Wt(){const e=Nt(),{isConnected:t}=$();return t?e&&(e==="loading"||e==="unauthenticated")?e:"connected":"disconnected"}function $r(){return typeof navigator<"u"&&/android/i.test(navigator.userAgent)}function Ul(){return typeof navigator<"u"&&/iPhone|iPod/.test(navigator.userAgent)}function Ql(){return typeof navigator<"u"&&(/iPad/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)}function st(){return Ul()||Ql()}function z(){return $r()||st()}var ql="iekbcc0",Vl={a:"iekbcca",blockquote:"iekbcc2",button:"iekbcc9",input:"iekbcc8 iekbcc5 iekbcc4",mark:"iekbcc6",ol:"iekbcc1",q:"iekbcc2",select:"iekbcc7 iekbcc5 iekbcc4",table:"iekbcc3",textarea:"iekbcc5 iekbcc4",ul:"iekbcc1"},zl=({reset:e,...t})=>{if(!e)return Cn(t);const n=Vl[e],o=Cn(t);return fr(ql,n,o)},w=a.forwardRef(({as:e="div",className:t,testId:n,...o},r)=>{const i={},s={};for(const m in o)Cn.properties.has(m)?i[m]=o[m]:s[m]=o[m];const c=zl({reset:typeof e=="string"?e:"div",...i});return a.createElement(e,{className:fr(c,t),...s,"data-testid":n?`rk-${n.replace(/^rk-/,"")}`:void 0,ref:r})});w.displayName="Box";var ea=new Map,$t=new Map;async function ta(e){const t=$t.get(e);if(t)return t;const n=async()=>e().then(async r=>(ea.set(e,r),r)),o=n().catch(r=>n().catch(i=>{$t.delete(e)}));return $t.set(e,o),o}async function we(...e){return await Promise.all(e.map(t=>typeof t=="function"?ta(t):t))}function Hl(){const[,e]=b.useReducer(t=>t+1,0);return e}function Pt(e){const t=typeof e=="function"?ea.get(e):void 0,n=Hl();return b.useEffect(()=>{typeof e=="function"&&!t&&ta(e).then(n)},[e,t,n]),typeof e=="function"?t:e}function Y({alt:e,background:t,borderColor:n,borderRadius:o,useAsImage:r,boxShadow:i,height:s,src:c,width:m,testId:g}){const d=st(),h=Pt(c),l=h&&/^http/.test(h),[f,u]=b.useReducer(()=>!0,!1);return a.createElement(w,{"aria-label":e,borderRadius:o,boxShadow:i,height:typeof s=="string"?s:void 0,overflow:"hidden",position:"relative",role:"img",style:{background:t,height:typeof s=="number"?s:void 0,width:typeof m=="number"?m:void 0},width:typeof m=="string"?m:void 0,testId:g},a.createElement(w,{...l?{"aria-hidden":!0,as:"img",onLoad:u,src:h}:{"aria-hidden":!0,as:"img",src:h},height:"full",position:"absolute",...d?{WebkitUserSelect:"none"}:{},style:{WebkitTouchCallout:"none",transition:"opacity .15s linear",userSelect:"none",...!r&&l?{opacity:f?1:0}:{}},width:"full"}),n?a.createElement(w,{...typeof n=="object"&&"custom"in n?{style:{borderColor:n.custom}}:{borderColor:n},borderRadius:o,borderStyle:"solid",borderWidth:"1",height:"full",position:"relative",width:"full"}):null)}var Kl="_1luule42",Gl="_1luule43",Jl=e=>b.useMemo(()=>`${e}_${Math.round(Math.random()*1e9)}`,[e]),Qe=({height:e=21,width:t=21})=>{const n=Jl("spinner");return a.createElement("svg",{className:Kl,fill:"none",height:e,viewBox:"0 0 21 21",width:t,xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Loading"),a.createElement("clipPath",{id:n},a.createElement("path",{d:"M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C11.3284 18 12 18.6716 12 19.5C12 20.3284 11.3284 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 11.3284 20.3284 12 19.5 12C18.6716 12 18 11.3284 18 10.5C18 6.35786 14.6421 3 10.5 3Z"})),a.createElement("foreignObject",{clipPath:`url(#${n})`,height:"21",width:"21",x:"0",y:"0"},a.createElement("div",{className:Gl})))},O=["#FC5C54","#FFD95A","#E95D72","#6A87C8","#5FD0F3","#75C06B","#FFDD86","#5FC6D4","#FF949A","#FF8024","#9BA1A4","#EC66FF","#FF8CBC","#FF9A23","#C5DADB","#A8CE63","#71ABFF","#FFE279","#B6B1B6","#FF6780","#A575FF","#4D82FF","#FFB35A"],Oo=[{color:O[0],emoji:"🌶"},{color:O[1],emoji:"🤑"},{color:O[2],emoji:"🐙"},{color:O[3],emoji:"🫐"},{color:O[4],emoji:"🐳"},{color:O[0],emoji:"🤶"},{color:O[5],emoji:"🌲"},{color:O[6],emoji:"🌞"},{color:O[7],emoji:"🐒"},{color:O[8],emoji:"🐵"},{color:O[9],emoji:"🦊"},{color:O[10],emoji:"🐼"},{color:O[11],emoji:"🦄"},{color:O[12],emoji:"🐷"},{color:O[13],emoji:"🐧"},{color:O[8],emoji:"🦩"},{color:O[14],emoji:"👽"},{color:O[0],emoji:"🎈"},{color:O[8],emoji:"🍉"},{color:O[1],emoji:"🎉"},{color:O[15],emoji:"🐲"},{color:O[16],emoji:"🌎"},{color:O[17],emoji:"🍊"},{color:O[18],emoji:"🐭"},{color:O[19],emoji:"🍣"},{color:O[1],emoji:"🐥"},{color:O[20],emoji:"👾"},{color:O[15],emoji:"🥦"},{color:O[0],emoji:"👹"},{color:O[17],emoji:"🙀"},{color:O[4],emoji:"⛱"},{color:O[21],emoji:"⛵️"},{color:O[17],emoji:"🥳"},{color:O[8],emoji:"🤯"},{color:O[22],emoji:"🤠"}];function Yl(e){let t=0;if(e.length===0)return t;for(let n=0;n<e.length;n++){const o=e.charCodeAt(n);t=(t<<5)-t+o,t|=0}return t}function Xl(e){const n=Math.abs(Yl((typeof e=="string"?e:"").toLowerCase())%Oo.length);return Oo[n??0]}var Zl=({address:e,ensImage:t,size:n})=>{const[o,r]=b.useState(!1);b.useEffect(()=>{if(t){const c=new Image;c.src=t,c.onload=()=>r(!0)}},[t]);const{color:i,emoji:s}=b.useMemo(()=>Xl(e),[e]);return t?o?a.createElement(w,{backgroundSize:"cover",borderRadius:"full",position:"absolute",style:{backgroundImage:`url(${t})`,backgroundPosition:"center",height:n,width:n}}):a.createElement(w,{alignItems:"center",backgroundSize:"cover",borderRadius:"full",color:"modalText",display:"flex",justifyContent:"center",position:"absolute",style:{height:n,width:n}},a.createElement(Qe,null)):a.createElement(w,{alignItems:"center",display:"flex",justifyContent:"center",overflow:"hidden",style:{...!t&&{backgroundColor:i},height:n,width:n}},s)},na=Zl,oa=b.createContext(na);function ra({address:e,imageUrl:t,loading:n,size:o}){const r=b.useContext(oa);return a.createElement(w,{"aria-hidden":!0,borderRadius:"full",overflow:"hidden",position:"relative",style:{height:`${o}px`,width:`${o}px`},userSelect:"none"},a.createElement(w,{alignItems:"center",borderRadius:"full",display:"flex",justifyContent:"center",overflow:"hidden",position:"absolute",style:{fontSize:`${Math.round(o*.55)}px`,height:`${o}px`,transform:n?"scale(0.72)":void 0,transition:".25s ease",transitionDelay:n?void 0:".1s",width:`${o}px`,willChange:"transform"},userSelect:"none"},a.createElement(r,{address:e,ensImage:t,size:o})),n&&a.createElement(w,{color:"accentColor",display:"flex",height:"full",position:"absolute",width:"full"},a.createElement(Qe,{height:"100%",width:"100%"})))}var Lo=()=>a.createElement("svg",{fill:"none",height:"7",width:"14",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Dropdown"),a.createElement("path",{d:"M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2.5",xmlns:"http://www.w3.org/2000/svg"})),Fo={defaultLocale:"en",locale:"en"},$l=class{constructor(e){this.listeners=new Set,this.defaultLocale=Fo.defaultLocale,this.enableFallback=!1,this.locale=Fo.locale,this.cachedLocales=[],this.translations={};for(const[t,n]of Object.entries(e))this.cachedLocales=[...this.cachedLocales,t],this.translations={...this.translations,...this.flattenTranslation(n,t)}}missingMessage(e){return`[missing: "${this.locale}.${e}" translation]`}flattenTranslation(e,t){const n={},o=(r,i)=>{for(const s of Object.keys(r)){const c=`${i}.${s}`,m=r[s];typeof m=="object"&&m!==null?o(m,c):n[c]=m}};return o(e,t),n}translateWithReplacements(e,t={}){let n=e;for(const o in t){const r=t[o];n=n.replace(`%{${o}}`,r)}return n}t(e,t,n){const o=`${this.locale}.${e}`,r=this.translations[o];if(!r){if(this.enableFallback){const i=`${this.defaultLocale}.${e}`,s=this.translations[i];if(s)return this.translateWithReplacements(s,t)}return n?.rawKeyIfTranslationMissing?e:this.missingMessage(e)}return this.translateWithReplacements(r,t)}isLocaleCached(e){return this.cachedLocales.includes(e)}updateLocale(e){this.locale=e,this.notifyListeners()}setTranslations(e,t){this.isLocaleCached(e)||(this.cachedLocales=[...this.cachedLocales,e],this.translations={...this.translations,...this.flattenTranslation(t,e)}),this.locale=e,this.notifyListeners()}notifyListeners(){for(const e of this.listeners)e()}onChange(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}},ce=new $l({en:JSON.parse(pn),"en-US":JSON.parse(pn)});ce.defaultLocale="en-US";ce.locale="en-US";ce.enableFallback=!0;var ec=async e=>{switch(e){case"ar":case"ar-AR":return(await k(async()=>{const{default:t}=await import("./ar_AR-CTNWGWSS-DlAFo0vZ.js");return{default:t}},[])).default;case"de":case"de-DE":return(await k(async()=>{const{default:t}=await import("./de_DE-P43L3PR7-pJRS3eyz.js");return{default:t}},[])).default;case"en":case"en-US":return(await k(async()=>{const{default:t}=await Promise.resolve().then(()=>dr);return{default:t}},void 0)).default;case"es":case"es-419":return(await k(async()=>{const{default:t}=await import("./es_419-JBX5FS3Q-Bk-MlIq_.js");return{default:t}},[])).default;case"fr":case"fr-FR":return(await k(async()=>{const{default:t}=await import("./fr_FR-CM2EDAQC-DvlCXiU9.js");return{default:t}},[])).default;case"hi":case"hi-IN":return(await k(async()=>{const{default:t}=await import("./hi_IN-GYVCUYRD-CQnOa8U_.js");return{default:t}},[])).default;case"id":case"id-ID":return(await k(async()=>{const{default:t}=await import("./id_ID-7ZWSMOOE-ZzIoBaiI.js");return{default:t}},[])).default;case"ja":case"ja-JP":return(await k(async()=>{const{default:t}=await import("./ja_JP-CGMP6VLZ-BBxPp4Hq.js");return{default:t}},[])).default;case"ko":case"ko-KR":return(await k(async()=>{const{default:t}=await import("./ko_KR-YCZDTF7X-4W342j3x.js");return{default:t}},[])).default;case"ms":case"ms-MY":return(await k(async()=>{const{default:t}=await import("./ms_MY-5LHAYMS7-BUU8UB2I.js");return{default:t}},[])).default;case"pt":case"pt-BR":return(await k(async()=>{const{default:t}=await import("./pt_BR-3JTS4PSK-Cou37HE0.js");return{default:t}},[])).default;case"ru":case"ru-RU":return(await k(async()=>{const{default:t}=await import("./ru_RU-6J6XERHI-BEDPqa1p.js");return{default:t}},[])).default;case"th":case"th-TH":return(await k(async()=>{const{default:t}=await import("./th_TH-STXOD4CR-DmwaGyKS.js");return{default:t}},[])).default;case"tr":case"tr-TR":return(await k(async()=>{const{default:t}=await import("./tr_TR-P7QAUUZU-DHzPxq5a.js");return{default:t}},[])).default;case"ua":case"uk-UA":return(await k(async()=>{const{default:t}=await import("./uk_UA-JTTBGJGQ-bEPIKyyu.js");return{default:t}},[])).default;case"vi":case"vi-VN":return(await k(async()=>{const{default:t}=await import("./vi_VN-5XUUAVWW-DvcbUvCZ.js");return{default:t}},[])).default;case"zh":case"zh-CN":case"zh-Hans":return(await k(async()=>{const{default:t}=await import("./zh_CN-RGMLPFEP-CPkk4IYh.js");return{default:t}},[])).default;case"zh-HK":return(await k(async()=>{const{default:t}=await import("./zh_HK-YM3T6EI5-BYHcXtXC.js");return{default:t}},[])).default;case"zh-Hant":case"zh-TW":return(await k(async()=>{const{default:t}=await import("./zh_TW-HAEH6VE5-r-nym7hs.js");return{default:t}},[])).default;default:return(await k(async()=>{const{default:t}=await Promise.resolve().then(()=>dr);return{default:t}},void 0)).default}};async function No(e){if(ce.isLocaleCached(e)){ce.updateLocale(e);return}const n=await ec(e);ce.setTranslations(e,JSON.parse(n))}var tc=()=>{if(typeof window<"u"&&typeof navigator<"u"){if(navigator.languages?.length)return navigator.languages[0];if(navigator.language)return navigator.language}},H=b.createContext({i18n:ce}),nc=({children:e,locale:t})=>{const[n,o]=b.useState(0),r=b.useMemo(()=>tc(),[]);b.useEffect(()=>ce.onChange(()=>{o(c=>c+1)}),[]),b.useEffect(()=>{t&&t!==ce.locale?No(t):!t&&r&&r!==ce.locale&&No(r)},[t,r]);const i=b.useMemo(()=>({t:(c,m)=>ce.t(c,m),i18n:ce}),[n]);return a.createElement(H.Provider,{value:i},e)};function aa(e){return e!=null}var Wo={iconBackground:"#7290CC",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./apechain-SX5YFU6N-q5qBv-mp.js");return{default:e}},[])).default},en={iconBackground:"#96bedc",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./arbitrum-WURIBY6W-CqVkHBr5.js");return{default:e}},[])).default},Po={iconBackground:"#e84141",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./avalanche-KOMJD3XY-Dsn_JPR4.js");return{default:e}},[])).default},tn={iconBackground:"#0052ff",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./base-OAXLRA4F-CoYTVIiL.js");return{default:e}},[])).default},nn={iconBackground:"#814625",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./berachain-NJECWIVC-DumxnFvf.js");return{default:e}},[])).default},Uo={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./blast-V555OVXZ-BbhJh1tj.js");return{default:e}},[])).default},Qo={iconBackground:"#ebac0e",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./bsc-N647EYR2-B2nLKXWV.js");return{default:e}},[])).default},qo={iconBackground:"#FCFF52",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./celo-GEP4TUHG-CenIBYLU.js");return{default:e}},[])).default},Vo={iconBackground:"#002D74",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./cronos-HJPAQTAE-BEOvlOC4.js");return{default:e}},[])).default},oc={iconBackground:"#A36EFD",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./degen-FQQ4XGHB-CeHTs88l.js");return{default:e}},[])).default},Ae={iconBackground:"#484c50",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./ethereum-RGGVA4PY-SWGOlkuk.js");return{default:e}},[])).default},zo={iconBackground:"transparent",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./flow-5FQJFCTK-CUie2reO.js");return{default:e}},[])).default},rc={iconBackground:"#04795c",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./gnosis-37ZC4RBL-B137OtHZ.js");return{default:e}},[])).default},Ho={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./gravity-J5YQHTYH-Bj6B0uod.js");return{default:e}},[])).default},ac={iconBackground:"#f9f7ec",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./hardhat-TX56IT5N-CV1FY-wE.js");return{default:e}},[])).default},ic={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./hyperevm-VKPAA4SA-CHwraEsx.js");return{default:e}},[])).default},Ko={iconBackground:"#7132F5",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./ink-FZMYZWHG-62p-5IK5.js");return{default:e}},[])).default},Go={iconBackground:"transparent",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./kaia-65D2U3PU-JmuLQ4gC.js");return{default:e}},[])).default},on={iconBackground:"#ffffff",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./linea-QRMVQ5DY-DuI3vv0d.js");return{default:e}},[])).default},rn={iconBackground:"#ffffff",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./manta-SI27YFEJ-CpVOKa06.js");return{default:e}},[])).default},Jo={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./mantle-CKIUT334-DR2WgqzU.js");return{default:e}},[])).default},sc={iconBackground:"transparent",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./monad-4KWC6TSS-DVXSkpiz.js");return{default:e}},[])).default},gt={iconBackground:"#ff5a57",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./optimism-HAF2GUT7-ec6Nqxs9.js");return{default:e}},[])).default},an={iconBackground:"#9f71ec",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./polygon-WW6ZI7PM-DXlmm4L1.js");return{default:e}},[])).default},lc={iconBackground:"#1273EA",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./ronin-EMCPYXZT-N-QBHZdV.js");return{default:e}},[])).default},cc={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./sanko-RHQYXGM5-OX010CbN.js");return{default:e}},[])).default},uc={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./superposition-HG6MMR2Y-bRkgatRO.js");return{default:e}},[])).default},Yo={iconBackground:"#FFEEDA",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./scroll-5OBGQVOV-DJFECiai.js");return{default:e}},[])).default},Xo={iconBackground:"#F50DB4",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./unichain-C5BWO2ZY-BfguYsnu.js");return{default:e}},[])).default},Zo={iconBackground:"#f9f7ec",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./xdc-KJ3TDBYO-DNV6zchh.js");return{default:e}},[])).default},$o={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./zetachain-TLDS5IPW-Udhyw16T.js");return{default:e}},[])).default},er={iconBackground:"#f9f7ec",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./zksync-DH7HK5U4-Dt4usFw6.js");return{default:e}},[])).default},sn={iconBackground:"#000000",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./zora-FYL5H3IO-iB4wygST.js");return{default:e}},[])).default},dc={apechain:{chainId:33139,name:"ApeChain",...Wo},apechainCurtis:{chainId:33111,name:"ApeChain Curtis",...Wo},arbitrum:{chainId:42161,name:"Arbitrum",...en},arbitrumGoerli:{chainId:421613,...en},arbitrumSepolia:{chainId:421614,...en},avalanche:{chainId:43114,...Po},avalancheFuji:{chainId:43113,...Po},base:{chainId:8453,name:"Base",...tn},baseGoerli:{chainId:84531,...tn},baseSepolia:{chainId:84532,...tn},berachain:{chainId:80094,name:"Berachain",...nn},berachainArtio:{chainId:80085,name:"Berachain Artio",...nn},berachainBArtio:{chainId:80084,name:"Berachain bArtio",...nn},blast:{chainId:81457,name:"Blast",...Uo},blastSepolia:{chainId:168587773,...Uo},bsc:{chainId:56,name:"BSC",...Qo},bscTestnet:{chainId:97,...Qo},celo:{chainId:42220,name:"Celo",...qo},celoAlfajores:{chainId:44787,name:"Celo Alfajores",...qo},cronos:{chainId:25,...Vo},cronosTestnet:{chainId:338,...Vo},degen:{chainId:666666666,name:"Degen",...oc},flow:{chainId:747,...zo},flowTestnet:{chainId:545,...zo},gnosis:{chainId:100,name:"Gnosis",...rc},goerli:{chainId:5,...Ae},gravity:{chainId:1625,name:"Gravity",...Ho},gravitySepolia:{chainId:13505,name:"Gravity Sepolia",...Ho},hardhat:{chainId:31337,...ac},holesky:{chainId:17e3,...Ae},hyperevm:{chainId:999,...ic},ink:{chainId:57073,...Ko},inkSepolia:{chainId:763373,...Ko},kaia:{chainId:8217,name:"Kaia",...Go},kairos:{chainId:1001,name:"Kairos",...Go},kovan:{chainId:42,...Ae},linea:{chainId:59144,name:"Linea",...on},lineaGoerli:{chainId:59140,name:"Linea Goerli",...on},lineaSepolia:{chainId:59141,name:"Linea Sepolia",...on},localhost:{chainId:1337,...Ae},mainnet:{chainId:1,name:"Ethereum",...Ae},manta:{chainId:169,name:"Manta",...rn},mantaSepolia:{chainId:3441006,...rn},mantaTestnet:{chainId:3441005,...rn},mantle:{chainId:5e3,...Jo},mantleTestnet:{chainId:5001,...Jo},monadTestnet:{chainId:10143,name:"Monad Testnet",...sc},optimism:{chainId:10,name:"Optimism",...gt},optimismGoerli:{chainId:420,...gt},optimismKovan:{chainId:69,...gt},optimismSepolia:{chainId:11155420,...gt},polygon:{chainId:137,name:"Polygon",...an},polygonAmoy:{chainId:80002,...an},polygonMumbai:{chainId:80001,...an},rinkeby:{chainId:4,...Ae},ronin:{chainId:2020,...lc},ropsten:{chainId:3,...Ae},sanko:{chainId:1996,name:"Sanko",...cc},scroll:{chainId:534352,...Yo},scrollSepolia:{chainId:534351,...Yo},sepolia:{chainId:11155111,...Ae},superposition:{chainId:55244,name:"Superposition",...uc},unichain:{chainId:130,...Xo},unichainSepolia:{chainId:1301,...Xo},xdc:{chainId:50,name:"XDC",...Zo},xdcTestnet:{chainId:51,...Zo},zetachain:{chainId:7e3,name:"ZetaChain",...$o},zetachainAthensTestnet:{chainId:7001,name:"Zeta Athens",...$o},zkSync:{chainId:324,name:"zkSync",...er},zkSyncTestnet:{chainId:280,...er},zora:{chainId:7777777,name:"Zora",...sn},zoraSepolia:{chainId:999999999,...sn},zoraTestnet:{chainId:999,...sn}},fc=Object.fromEntries(Object.values(dc).filter(aa).map(({chainId:e,...t})=>[e,t])),pc=e=>e.map(t=>{const n=fc[t.id]??{};return{...t,name:n.name??t.name,iconUrl:t.iconUrl??n.iconUrl,iconBackground:t.iconBackground??n.iconBackground}}),On=b.createContext({chains:[]});function hc({children:e,initialChain:t}){const{chains:n}=Rt();return a.createElement(On.Provider,{value:b.useMemo(()=>({chains:pc(n),initialChainId:typeof t=="number"?t:t?.id}),[n,t])},e)}var Te=()=>b.useContext(On).chains,mc=()=>b.useContext(On).initialChainId,gc=()=>{const e=Te();return b.useMemo(()=>{const t={};for(const n of e)t[n.id]=n;return t},[e])},ia=b.createContext({showBalance:void 0,setShowBalance:()=>{}});function wc({children:e}){const[t,n]=b.useState();return a.createElement(ia.Provider,{value:{showBalance:t,setShowBalance:n}},e)}var sa=()=>b.useContext(ia);function la(){const[e,t]=b.useState(!1);return b.useEffect(()=>(t(!0),()=>{t(!1)}),[]),b.useCallback(()=>e,[e])}function ca(){const e=Te(),t=In.id;return e.some(o=>o.id===t)}function vc(e){const t=ca(),n=r=>{try{return Cs(r)}catch{}},{data:o}=wi({chainId:In.id,name:e?n(e):void 0,query:{enabled:t}});return o}async function je(e,t){if(t={headers:{},method:"get",...t,timeout:t.timeout??1e4},!e)throw new Error("rainbowFetch: Missing url argument");const n=new AbortController,o=setTimeout(()=>n.abort(),t.timeout),{body:r,params:i,headers:s,...c}=t,m=r&&typeof r=="object"?JSON.stringify(t.body):t.body,g=await fetch(`${e}${Cc(i)}`,{...c,body:m,headers:{Accept:"application/json","Content-Type":"application/json",...s},signal:n.signal});clearTimeout(o);const d=await bc(g);if(g.ok){const{headers:f,status:u}=g;return{data:d,headers:f,status:u}}throw yc({requestBody:r,response:g,responseBody:typeof d=="string"?{error:d}:d})}function bc(e){return e.headers.get("Content-Type")?.startsWith("application/json")?e.json():e.text()}function Cc(e){return e&&Object.keys(e).length?`?${new URLSearchParams(e)}`:""}function yc({requestBody:e,response:t,responseBody:n}){const o=n?.error||t?.statusText||"There was an error with the request.",r=new Error(o);return r.response=t,r.responseBody=n,r.requestBody=e,r}var Ac=class{constructor(e={}){const{baseUrl:t="",...n}=e;this.baseUrl=t,this.opts=n}get(e,t){return je(`${this.baseUrl}${e}`,{...this.opts,...t||{},method:"get"})}delete(e,t){return je(`${this.baseUrl}${e}`,{...this.opts,...t||{},method:"delete"})}head(e,t){return je(`${this.baseUrl}${e}`,{...this.opts,...t||{},method:"head"})}options(e,t){return je(`${this.baseUrl}${e}`,{...this.opts,...t||{},method:"options"})}post(e,t,n){return je(`${this.baseUrl}${e}`,{...this.opts,...n||{},body:t,method:"post"})}put(e,t,n){return je(`${this.baseUrl}${e}`,{...this.opts,...n||{},body:t,method:"put"})}patch(e,t,n){return je(`${this.baseUrl}${e}`,{...this.opts,...n||{},body:t,method:"patch"})}};function Ec({baseUrl:e,headers:t,params:n,timeout:o}){return new Ac({baseUrl:e,headers:t,params:n,timeout:o})}var xc=!!(typeof process<"u"&&typeof Tt<"u"&&Tt.RAINBOW_PROVIDER_API_KEY),kc=Ec({baseUrl:"https://enhanced-provider.rainbow.me",headers:{"x-api-key":typeof process<"u"&&typeof Tt<"u"&&Tt.RAINBOW_PROVIDER_API_KEY||"LzbasoBiLqltex3VkcQ7LRmL4PtfiiZ1EMJrizrgfonWN6byJReu/l6yrUoo3zLW"}});function jc(e,t,n={}){return[e,t,n]}function At(e){return`rk-ens-name-${e}`}function _c(e){try{const t=e?JSON.parse(e):null;return typeof t=="object"?t:null}catch{return null}}function Bc(e,t){if(!mi(e))return;const n=new Date,o=new Date(n.getTime()+180*6e4);localStorage.setItem(At(e),JSON.stringify({ensName:t,expires:o.getTime()}))}function Ic(e){const t=_c(localStorage.getItem(At(e)));if(!t)return null;const{ensName:n,expires:o}=t;return typeof n!="string"||Number.isNaN(Number(o))||new Date().getTime()>Number(o)?(localStorage.removeItem(At(e)),null):n}async function Sc({address:e}){const t=Ic(e);if(t)return t;const o=(await kc.get("/v1/resolve-ens",{params:{address:e}})).data.data;return o&&Bc(e,o),o}function Tc(e){const t=ca(),{data:n}=gi({chainId:In.id,address:e,query:{enabled:t}}),{data:o}=hi({queryKey:jc("address",e),queryFn:()=>Sc({address:e}),enabled:!t&&!!e&&xc,staleTime:10*(60*1e3),retry:1});return n||o}function ua({address:e,includeBalance:t}){const n=Tc(e),o=vc(n),{data:r}=hr({address:t?e:void 0});return{ensName:n,ensAvatar:o,balance:r}}function Ut(){const{chain:e}=$();return e?.id??null}var da="rk-transactions";function Dc(e){try{const t=e?JSON.parse(e):{};return typeof t=="object"?t:{}}catch{return{}}}function tr(){return Dc(typeof localStorage<"u"?localStorage.getItem(da):null)}var Mc=/^0x([A-Fa-f0-9]{64})$/;function Rc(e){const t=[];return Mc.test(e.hash)||t.push("Invalid transaction hash"),typeof e.description!="string"&&t.push("Transaction must have a description"),typeof e.confirmations<"u"&&(!Number.isInteger(e.confirmations)||e.confirmations<1)&&t.push("Transaction confirmations must be a positiver integer"),t}function Oc({provider:e}){let t=tr(),n=e;const o=new Set,r=new Set,i=new Map;function s(A){n=A}function c(A,E){return t[A]?.[E]??[]}function m(A,E,C){const x=Rc(C);if(x.length>0)throw new Error(["Unable to add transaction",...x].join(`
`));l(A,E,j=>[{...C,status:"pending"},...j.filter(({hash:I})=>I!==C.hash)])}function g(A,E){l(A,E,()=>[])}function d(A,E,C,x){l(A,E,j=>j.map(I=>I.hash===C?{...I,status:x}:I))}async function h(A,E){await Promise.all(c(A,E).filter(C=>C.status==="pending").map(async C=>{const{confirmations:x,hash:j}=C,I=i.get(j);if(I)return await I;const D=n.waitForTransactionReceipt({confirmations:x,hash:j,timeout:3e5}).then(({status:L})=>{i.delete(j),L!==void 0&&(d(A,E,j,L===0||L==="reverted"?"failed":"confirmed"),p(L))}).catch(()=>{d(A,E,j,"failed")});return i.set(j,D),await D}))}function l(A,E,C){t=tr(),t[A]=t[A]??{};let x=0;const j=10,I=C(t[A][E]??[]).filter(({status:D})=>D==="pending"?!0:x++<=j);t[A][E]=I.length>0?I:void 0,f(),u(),h(A,E)}function f(){localStorage.setItem(da,JSON.stringify(t))}function u(){for(const A of o)A()}function p(A){for(const E of r)E(A)}function v(A){return o.add(A),()=>{o.delete(A)}}function y(A){return r.add(A),()=>{r.delete(A)}}return{addTransaction:m,clearTransactions:g,getTransactions:c,onTransactionStatus:y,onChange:v,setProvider:s,waitForPendingTransactions:h}}var nr,fa=a.createContext(null);function Lc({children:e}){const t=bi(),{address:n}=$(),o=Ut(),{refetch:r}=hr({address:n,query:{enabled:!1}}),[i]=a.useState(()=>nr??(nr=Oc({provider:t}))),s=a.useCallback(c=>{c==="success"&&r()},[r]);return a.useEffect(()=>{i.setProvider(t)},[i,t]),a.useEffect(()=>{n&&o&&i.waitForPendingTransactions(n,o)},[i,n,o]),a.useEffect(()=>{if(i&&n&&o)return i.onTransactionStatus(s)},[i,n,o,s]),a.createElement(fa.Provider,{value:i},e)}function Ln(){const e=a.useContext(fa);if(!e)throw new Error("Transaction hooks must be used within RainbowKitProvider");return e}function pa(){const e=Ln(),{address:t}=$(),n=Ut(),[o,r]=b.useState(()=>e&&t&&n?e.getTransactions(t,n):[]);return b.useEffect(()=>{if(e&&t&&n)return r(e.getTransactions(t,n)),e.onChange(()=>{r(e.getTransactions(t,n))})},[e,t,n]),o}var or=e=>typeof e=="function"?e():e;function ha(e,{extends:t}={}){const n={...ko(Ro,or(e))};if(!t)return n;const o=ko(Ro,or(t));return Object.fromEntries(Object.entries(n).filter(([i,s])=>s!==o[i]))}function yn(e,t={}){return Object.entries(ha(e,t)).map(([n,o])=>`${n}:${o.replace(/[:;{}</>]/g,"")};`).join("")}var ma={appName:void 0,disclaimer:void 0,learnMoreUrl:"https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore"},lt=b.createContext(ma),ga=b.createContext(!1);function Fc(e,t){let n;return()=>{n&&clearTimeout(n),n=setTimeout(()=>{n=null,e()},t)}}var wa=()=>{const[e,t]=b.useState({height:void 0,width:void 0});return b.useEffect(()=>{const n=Fc(()=>{t({height:window.innerHeight,width:window.innerWidth})},500);return window.addEventListener("resize",n),n(),()=>window.removeEventListener("resize",n)},[]),e},Ve=b.createContext({connector:null,setConnector:()=>{}});function Nc({children:e}){const[t,n]=b.useState(null);return a.createElement(Ve.Provider,{value:b.useMemo(()=>({connector:t,setConnector:n}),[t])},e)}var ct={COMPACT:"compact",WIDE:"wide"},Qt=b.createContext(ct.WIDE);function Wc({children:e,modalSize:t}){const{width:n}=wa(),o=n&&n<Rl,{connector:r}=b.useContext(Ve);return a.createElement(Qt.Provider,{value:o||r?ct.COMPACT:t},e)}var Fn=b.createContext(!1),Pc="rk-version";function Uc({version:e}){localStorage.setItem(Pc,e)}function Qc(){const e=b.useCallback(()=>{Uc({version:"2.2.9"})},[]);b.useEffect(()=>{e()},[e])}function qc(e,t){const n={};for(const o of e){const r=t(o);r&&(n[r]=o)}return n}function Nn(){return typeof navigator<"u"&&typeof navigator.userAgent<"u"&&/Version\/([0-9._]+).*Safari/.test(navigator.userAgent)}function Vc(){return typeof document<"u"&&getComputedStyle(document.body).getPropertyValue("--arc-palette-focus")!==""}function Wn(){if(typeof navigator>"u")return"Browser";const e=navigator.userAgent?.toLowerCase();return navigator.brave?.isBrave?"Brave":e?.indexOf("edg/")>-1?"Edge":e?.indexOf("op")>-1?"Opera":Vc()?"Arc":e?.indexOf("chrome")>-1?"Chrome":e?.indexOf("firefox")>-1?"Firefox":Nn()?"Safari":"Browser"}var zc=il.UAParser(),{os:Pn}=zc;function Hc(){return Pn.name==="Windows"}function Kc(){return Pn.name==="Mac OS"}function Gc(){return["Ubuntu","Mint","Fedora","Debian","Arch","Linux"].includes(Pn.name)}function Un(){return Hc()?"Windows":Kc()?"macOS":Gc()?"Linux":"Desktop"}var Jc=e=>{const t=Wn();return{Arc:e?.downloadUrls?.chrome,Brave:e?.downloadUrls?.chrome,Chrome:e?.downloadUrls?.chrome,Edge:e?.downloadUrls?.edge||e?.downloadUrls?.chrome,Firefox:e?.downloadUrls?.firefox,Opera:e?.downloadUrls?.opera||e?.downloadUrls?.chrome,Safari:e?.downloadUrls?.safari,Browser:e?.downloadUrls?.browserExtension}[t]??e?.downloadUrls?.browserExtension},Yc=e=>(st()?e?.downloadUrls?.ios:e?.downloadUrls?.android)??e?.downloadUrls?.mobile,Xc=e=>{const t=Un();return{Windows:e?.downloadUrls?.windows,macOS:e?.downloadUrls?.macos,Linux:e?.downloadUrls?.linux,Desktop:e?.downloadUrls?.desktop}[t]??e?.downloadUrls?.desktop},va=(e,t)=>e.some(n=>n.id===t),Zc=e=>!!e.isRainbowKitConnector,rr=e=>!!(!e.isRainbowKitConnector&&e.icon?.replace(/\n/g,"").startsWith("data:image")&&e.uid&&e.name),$c=(e,t)=>e.id==="walletConnect"&&t?{...e,walletConnectModalConnector:t}:e,eu=({wallets:e,recentWallets:t})=>[...t,...e.filter(n=>!va(t,n.id))],ba="rk-recent";function tu(e){try{const t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch{return[]}}function Ca(){return typeof localStorage<"u"?tu(localStorage.getItem(ba)):[]}function nu(e){return[...new Set(e)]}function ou(e){const t=nu([e,...Ca()]);localStorage.setItem(ba,JSON.stringify(t))}function qe(e=!1){const t=Te(),n=mc(),{connectAsync:o,connectors:r}=Ci(),i=r,{setIsWalletConnectModalOpen:s}=$a(),c=i.map(C=>({...C,...C.rkDetails||{}}));async function m(C,x){const j=await C.getChainId(),I=await o({...x,chainId:x?.chainId??n??t.find(({id:D})=>D===j)?.id??t[0]?.id,connector:C});return I&&ou(C.id),I}async function g(C){try{s(!0),await m(C),s(!1)}catch(x){const j=x.name==="UserRejectedRequestError"||x.message==="Connection request reset. Please try again.";if(s(!1),!j)throw x}}const d=async(C,x)=>{const j=await C.getProvider();return C.id==="coinbase"?j.qrUrl:new Promise(I=>j.once("display_uri",D=>{I(x(D))}))},h=c.find(C=>C.id==="walletConnect"&&C.isWalletConnectModalConnector),l=c.filter(rr).map(C=>({...C,groupIndex:0})),f=c.filter(Zc).filter(C=>!C.isWalletConnectModalConnector).filter(C=>e?!l.some(j=>j.id===C.rdns):!0).map(C=>$c(C,h)),u=[...l,...f],p=qc(u,C=>C.id),y=Ca().map(C=>p[C]).filter(Boolean).slice(0,3),A=[],E=eu({wallets:u,recentWallets:y});for(const C of E){if(!C)continue;const x=rr(C),j=va(y,C.id);if(x){A.push({...C,iconUrl:C.icon,ready:!0,connect:m.bind(null,C),groupName:"Installed",recent:j});continue}A.push({...C,ready:C.installed??!0,connect:m.bind(null,C),desktopDownloadUrl:Xc(C),extensionDownloadUrl:Jc(C),groupName:C.groupName,mobileDownloadUrl:Yc(C),getQrCodeUri:C.qrCode?.getUri?()=>d(C,C.qrCode.getUri):void 0,getDesktopUri:C.desktop?.getUri?()=>d(C,C.desktop.getUri):void 0,getMobileUri:C.mobile?.getUri?()=>d(C,C.mobile?.getUri):void 0,recent:j,showWalletConnectModal:C.walletConnectModalConnector?()=>g(C.walletConnectModalConnector):void 0})}return A}var ya=async()=>(await k(async()=>{const{default:e}=await import("./assets-Q6ZU7ZJ5-P8HioiAD.js");return{default:e}},[])).default,ru=()=>we(ya),au=()=>a.createElement(Y,{background:"#d0d5de",borderRadius:"10",height:"48",src:ya,width:"48"}),Aa=async()=>(await k(async()=>{const{default:e}=await import("./login-UP3DZBGS-Db_wM5oQ.js");return{default:e}},[])).default,iu=()=>we(Aa),su=()=>a.createElement(Y,{background:"#d0d5de",borderRadius:"10",height:"48",src:Aa,width:"48"}),B=a.forwardRef(({as:e="div",children:t,className:n,color:o,display:r,font:i="body",id:s,size:c="16",style:m,tabIndex:g,textAlign:d="inherit",weight:h="regular",testId:l},f)=>a.createElement(w,{as:e,className:n,color:o,display:r,fontFamily:i,fontSize:c,fontWeight:h,id:s,ref:f,style:m,tabIndex:g,textAlign:d,testId:l},t));B.displayName="Text";var lu={large:{fontSize:"16",paddingX:"24",paddingY:"10"},medium:{fontSize:"14",height:"28",paddingX:"12",paddingY:"4"},small:{fontSize:"14",paddingX:"10",paddingY:"5"}};function oe({disabled:e=!1,href:t,label:n,onClick:o,rel:r="noreferrer noopener",size:i="medium",target:s="_blank",testId:c,type:m="primary"}){const g=m==="primary",d=i!=="large",h=z(),l=e?"actionButtonSecondaryBackground":g?"accentColor":d?"actionButtonSecondaryBackground":null,{fontSize:f,height:u,paddingX:p,paddingY:v}=lu[i],y=!h||!d;return a.createElement(w,{...t?e?{}:{as:"a",href:t,rel:r,target:s}:{as:"button",type:"button"},onClick:e?void 0:o,...y?{borderColor:h&&!d&&!g?"actionButtonBorderMobile":"actionButtonBorder",borderStyle:"solid",borderWidth:"1"}:{},borderRadius:"actionButton",className:!e&&V({active:"shrinkSm",hover:"grow"}),display:"block",paddingX:p,paddingY:v,style:{willChange:"transform"},testId:c,textAlign:"center",transition:"transform",...l?{background:l}:{},...u?{height:u}:{}},a.createElement(B,{color:e?"modalTextSecondary":g?"accentColorForeground":"accentColor",size:f,weight:"bold"},n))}var cu=()=>z()?a.createElement("svg",{"aria-hidden":!0,fill:"none",height:"11.5",viewBox:"0 0 11.5 11.5",width:"11.5",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Close"),a.createElement("path",{d:"M2.13388 0.366117C1.64573 -0.122039 0.854272 -0.122039 0.366117 0.366117C-0.122039 0.854272 -0.122039 1.64573 0.366117 2.13388L3.98223 5.75L0.366117 9.36612C-0.122039 9.85427 -0.122039 10.6457 0.366117 11.1339C0.854272 11.622 1.64573 11.622 2.13388 11.1339L5.75 7.51777L9.36612 11.1339C9.85427 11.622 10.6457 11.622 11.1339 11.1339C11.622 10.6457 11.622 9.85427 11.1339 9.36612L7.51777 5.75L11.1339 2.13388C11.622 1.64573 11.622 0.854272 11.1339 0.366117C10.6457 -0.122039 9.85427 -0.122039 9.36612 0.366117L5.75 3.98223L2.13388 0.366117Z",fill:"currentColor"})):a.createElement("svg",{"aria-hidden":!0,fill:"none",height:"10",viewBox:"0 0 10 10",width:"10",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Close"),a.createElement("path",{d:"M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z",fill:"currentColor"})),Se=({"aria-label":e="Close",onClose:t})=>{const n=z();return a.createElement(w,{alignItems:"center","aria-label":e,as:"button",background:"closeButtonBackground",borderColor:"actionButtonBorder",borderRadius:"full",borderStyle:"solid",borderWidth:n?"0":"1",className:V({active:"shrinkSm",hover:"growLg"}),color:"closeButton",display:"flex",height:n?"30":"28",justifyContent:"center",onClick:t,style:{willChange:"transform"},transition:"default",type:"button",width:n?"30":"28"},a.createElement(cu,null))},Ea=async()=>(await k(async()=>{const{default:e}=await import("./sign-A7IJEUT5-CGsRnPrd.js");return{default:e}},[])).default;function uu({onClose:e,onCloseModal:t}){const{i18n:n}=b.useContext(H),[{status:o,...r},i]=a.useState({status:"idle"}),s=Pl(),c=b.useCallback(async()=>{try{const u=await s.getNonce();i(p=>({...p,nonce:u}))}catch{i(u=>({...u,errorMessage:n.t("sign_in.message.preparing_error"),status:"idle"}))}},[s,n.t]),m=b.useRef(!1);a.useEffect(()=>{m.current||(m.current=!0,c())},[c]);const g=z(),{address:d,chain:h}=$(),{signMessageAsync:l}=Ei(),f=async()=>{try{const u=h?.id,{nonce:p}=r;if(!d||!u||!p)return;i(A=>({...A,errorMessage:void 0,status:"signing"}));const v=s.createMessage({address:d,chainId:u,nonce:p});let y;try{y=await l({message:v})}catch(A){return A instanceof ne?i(E=>({...E,status:"idle"})):i(E=>({...E,errorMessage:n.t("sign_in.signature.signing_error"),status:"idle"}))}i(A=>({...A,status:"verifying"}));try{if(await s.verify({message:v,signature:y})){t();return}throw new Error}catch{return i(A=>({...A,errorMessage:n.t("sign_in.signature.verifying_error"),status:"idle"}))}}catch{i({errorMessage:n.t("sign_in.signature.oops_error"),status:"idle"})}};return a.createElement(w,{position:"relative"},a.createElement(w,{display:"flex",paddingRight:"16",paddingTop:"16",position:"absolute",right:"0"},a.createElement(Se,{onClose:e})),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:g?"32":"24",padding:"24",paddingX:"18",style:{paddingTop:g?"60px":"36px"}},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:g?"6":"4",style:{maxWidth:g?320:280}},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:g?"32":"16"},a.createElement(Y,{height:40,src:Ea,width:40}),a.createElement(B,{color:"modalText",size:g?"20":"18",textAlign:"center",weight:"heavy"},n.t("sign_in.label"))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:g?"16":"12"},a.createElement(B,{color:"modalTextSecondary",size:g?"16":"14",textAlign:"center"},n.t("sign_in.description")),o==="idle"&&r.errorMessage?a.createElement(B,{color:"error",size:g?"16":"14",textAlign:"center",weight:"bold"},r.errorMessage):null)),a.createElement(w,{alignItems:g?void 0:"center",display:"flex",flexDirection:"column",gap:"8",width:"full"},a.createElement(oe,{disabled:!r.nonce||o==="signing"||o==="verifying",label:r.nonce?o==="signing"?n.t("sign_in.signature.waiting"):o==="verifying"?n.t("sign_in.signature.verifying"):n.t("sign_in.message.send"):n.t("sign_in.message.preparing"),onClick:f,size:g?"large":"medium",testId:"auth-message-button"}),g?a.createElement(oe,{label:"Cancel",onClick:e,size:"large",type:"secondary"}):a.createElement(w,{as:"button",borderRadius:"full",className:V({active:"shrink",hover:"grow"}),display:"block",onClick:e,paddingX:"10",paddingY:"5",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},a.createElement(B,{color:"closeButton",size:g?"16":"14",weight:"bold"},n.t("sign_in.message.cancel"))))))}function du(){const e=Te(),t=qe(),n=Nt()==="unauthenticated",o=b.useCallback(()=>{we(...t.map(r=>r.iconUrl),...e.map(r=>r.iconUrl).filter(aa)),z()||(ru(),iu()),n&&we(Ea)},[t,e,n]);b.useEffect(()=>{o()},[o])}var xa="WALLETCONNECT_DEEPLINK_CHOICE";function fu({mobileUri:e,name:t}){localStorage.setItem(xa,JSON.stringify({href:e.split("?")[0],name:t}))}function pu(){localStorage.removeItem(xa)}var ka=b.createContext(void 0),An="data-rk",ja=e=>({[An]:e||""}),hu=e=>{if(e&&!/^[a-zA-Z0-9_]+$/.test(e))throw new Error(`Invalid ID: ${e}`);return e?`[${An}="${e}"]`:`[${An}]`},mu=()=>{const e=b.useContext(ka);return ja(e)},gu=kn();function wu({appInfo:e,avatar:t,children:n,coolMode:o=!1,id:r,initialChain:i,locale:s,modalSize:c=ct.WIDE,showRecentTransactions:m=!1,theme:g=gu}){if(du(),Qc(),Ot({onDisconnect:pu}),typeof g=="function")throw new Error('A theme function was provided to the "theme" prop instead of a theme object. You must execute this function to get the resulting theme object.');const d=hu(r),h={...ma,...e},l=t??na;return a.createElement(hc,{initialChain:i},a.createElement(Nc,null,a.createElement(nc,{locale:s},a.createElement(ga.Provider,{value:o},a.createElement(Wc,{modalSize:c},a.createElement(Fn.Provider,{value:m},a.createElement(Lc,null,a.createElement(oa.Provider,{value:l},a.createElement(lt.Provider,{value:h},a.createElement(ka.Provider,{value:r},a.createElement(wc,null,a.createElement(_d,null,g?a.createElement("div",{...ja(r)},a.createElement("style",{dangerouslySetInnerHTML:{__html:[`${d}{${yn("lightMode"in g?g.lightMode:g)}}`,"darkMode"in g?`@media(prefers-color-scheme:dark){${d}{${yn(g.darkMode,{extends:g.lightMode})}}}`:null].join("")}}),n):n))))))))))))}var vu="_9pm4ki5 ju367va ju367v15 ju367v8r",bu="_9pm4ki3 ju367v9h ju367vb3 ju367va ju367v2q ju367v8q",ar=(e,t)=>{const n=e.querySelectorAll("button:not(:disabled), a[href]");n.length!==0&&n[t==="end"?n.length-1:0].focus()};function Cu(e){const t=b.useRef(null);return b.useEffect(()=>{const n=document.activeElement;return()=>{n.focus?.()}},[]),b.useEffect(()=>{if(t.current){const n=t.current.querySelector("[data-auto-focus]");n?n.focus():t.current.focus()}},[]),a.createElement(a.Fragment,null,a.createElement("div",{onFocus:b.useCallback(()=>t.current&&ar(t.current,"end"),[]),tabIndex:0}),a.createElement("div",{ref:t,style:{outline:"none"},tabIndex:-1,...e}),a.createElement("div",{onFocus:b.useCallback(()=>t.current&&ar(t.current,"start"),[]),tabIndex:0}))}var yu=e=>e.stopPropagation();function Dt({children:e,onClose:t,open:n,titleId:o}){b.useEffect(()=>{const g=d=>n&&d.key==="Escape"&&t();return document.addEventListener("keydown",g),()=>document.removeEventListener("keydown",g)},[n,t]);const[r,i]=b.useState(!0);b.useEffect(()=>{i(getComputedStyle(window.document.body).overflow!=="hidden")},[]);const s=b.useCallback(()=>t(),[t]),c=mu(),m=z();return a.createElement(a.Fragment,null,n?ki.createPortal(a.createElement(Jr,{enabled:r},a.createElement(w,{...c},a.createElement(w,{...c,alignItems:m?"flex-end":"center","aria-labelledby":o,"aria-modal":!0,className:bu,onClick:s,position:"fixed",role:"dialog"},a.createElement(Cu,{className:vu,onClick:yu,role:"document"},e)))),document.body):null)}var Au="_1ckjpok7",_a="_1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r",Eu="_1ckjpok4 _1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r",Ba="_1ckjpok6 ju367vq",xu="_1ckjpok3 _1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r",ku="_1ckjpok2 _1ckjpok1 ju367vb6 ju367vdr ju367vp ju367vt ju367vv ju367vel ju367va ju367v15 ju367v6c ju367v8r";function Mt({bottomSheetOnMobile:e=!1,children:t,marginTop:n,padding:o="16",paddingBottom:r,wide:i=!1}){const s=z(),m=b.useContext(Qt)===ct.COMPACT;return a.createElement(w,{marginTop:n},a.createElement(w,{className:[i?s?ku:m?Eu:xu:_a,s?Ba:null,s&&e?Au:null].join(" ")},a.createElement(w,{padding:o,paddingBottom:r??o},t)))}var ir=["k","m","b","t"];function wt(e,t=1){return e.toString().replace(new RegExp(`(.+\\.\\d{${t}})\\d+`),"$1").replace(/(\.[1-9]*)0+$/,"$1").replace(/\.$/,"")}function Ia(e){if(e<1)return wt(e,3);if(e<10**2)return wt(e,2);if(e<10**4)return new Intl.NumberFormat().format(Number.parseFloat(wt(e,1)));const t=10**1;let n=String(e);for(let o=ir.length-1;o>=0;o--){const r=10**((o+1)*3);if(r<=e){e=e*t/r/t,n=wt(e,1)+ir[o];break}}return n}function Sa(e){return e.length<8?e:`${e.substring(0,4)}…${e.substring(e.length-4)}`}function Ta(e){if(!e)return"";const t=e.split("."),n=t.pop();return t.join(".").length>24?`${t.join(".").substring(0,24)}...`:`${t.join(".")}.${n}`}var ju=()=>a.createElement("svg",{fill:"none",height:"13",viewBox:"0 0 13 13",width:"13",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Copied"),a.createElement("path",{d:"M4.94568 12.2646C5.41052 12.2646 5.77283 12.0869 6.01892 11.7109L12.39 1.96973C12.5677 1.69629 12.6429 1.44336 12.6429 1.2041C12.6429 0.561523 12.1644 0.0966797 11.5082 0.0966797C11.057 0.0966797 10.7767 0.260742 10.5033 0.691406L4.9115 9.50977L2.07458 5.98926C1.82166 5.68848 1.54822 5.55176 1.16541 5.55176C0.502319 5.55176 0.0238037 6.02344 0.0238037 6.66602C0.0238037 6.95312 0.112671 7.20605 0.358765 7.48633L3.88611 11.7588C4.18005 12.1074 4.50818 12.2646 4.94568 12.2646Z",fill:"currentColor"})),_u=()=>a.createElement("svg",{fill:"none",height:"16",viewBox:"0 0 17 16",width:"17",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Copy"),a.createElement("path",{d:"M3.04236 12.3027H4.18396V13.3008C4.18396 14.8525 5.03845 15.7002 6.59705 15.7002H13.6244C15.183 15.7002 16.0375 14.8525 16.0375 13.3008V6.24609C16.0375 4.69434 15.183 3.84668 13.6244 3.84668H12.4828V2.8418C12.4828 1.29688 11.6283 0.442383 10.0697 0.442383H3.04236C1.48376 0.442383 0.629272 1.29004 0.629272 2.8418V9.90332C0.629272 11.4551 1.48376 12.3027 3.04236 12.3027ZM3.23376 10.5391C2.68689 10.5391 2.39294 10.2656 2.39294 9.68457V3.06055C2.39294 2.47949 2.68689 2.21289 3.23376 2.21289H9.8783C10.4252 2.21289 10.7191 2.47949 10.7191 3.06055V3.84668H6.59705C5.03845 3.84668 4.18396 4.69434 4.18396 6.24609V10.5391H3.23376ZM6.78845 13.9365C6.24158 13.9365 5.94763 13.6699 5.94763 13.0889V6.45801C5.94763 5.87695 6.24158 5.61035 6.78845 5.61035H13.433C13.9799 5.61035 14.2738 5.87695 14.2738 6.45801V13.0889C14.2738 13.6699 13.9799 13.9365 13.433 13.9365H6.78845Z",fill:"currentColor"})),Bu=()=>a.createElement("svg",{fill:"none",height:"16",viewBox:"0 0 18 16",width:"18",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Disconnect"),a.createElement("path",{d:"M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z",fill:"currentColor"}));function Iu(){const e=Ln(),{address:t}=$(),n=Ut();return b.useCallback(()=>{if(!t||!n)throw new Error("No address or chain ID found");e.clearTransactions(t,n)},[e,t,n])}var Da=e=>e?.blockExplorers?.default?.url,Ma=()=>a.createElement("svg",{fill:"none",height:"19",viewBox:"0 0 20 19",width:"20",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Link"),a.createElement("path",{d:"M10 18.9443C15.0977 18.9443 19.2812 14.752 19.2812 9.6543C19.2812 4.56543 15.0889 0.373047 10 0.373047C4.90234 0.373047 0.71875 4.56543 0.71875 9.6543C0.71875 14.752 4.91113 18.9443 10 18.9443ZM10 16.6328C6.1416 16.6328 3.03906 13.5215 3.03906 9.6543C3.03906 5.7959 6.13281 2.68457 10 2.68457C13.8584 2.68457 16.9697 5.7959 16.9697 9.6543C16.9785 13.5215 13.8672 16.6328 10 16.6328ZM12.7158 12.1416C13.2432 12.1416 13.5684 11.7549 13.5684 11.1836V7.19336C13.5684 6.44629 13.1377 6.05957 12.417 6.05957H8.40918C7.8291 6.05957 7.45117 6.38477 7.45117 6.91211C7.45117 7.43945 7.8291 7.77344 8.40918 7.77344H9.69238L10.7207 7.63281L9.53418 8.67871L6.73047 11.4912C6.53711 11.6758 6.41406 11.9395 6.41406 12.2031C6.41406 12.7832 6.85352 13.1699 7.39844 13.1699C7.68848 13.1699 7.92578 13.0732 8.1543 12.8623L10.9316 10.0762L11.9775 8.89844L11.8545 9.98828V11.1836C11.8545 11.7725 12.1885 12.1416 12.7158 12.1416Z",fill:"currentColor"})),Su=()=>a.createElement("svg",{fill:"none",height:"19",viewBox:"0 0 20 19",width:"20",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Cancel"),a.createElement("path",{d:"M10 18.9443C15.0977 18.9443 19.2812 14.752 19.2812 9.6543C19.2812 4.56543 15.0889 0.373047 10 0.373047C4.90234 0.373047 0.71875 4.56543 0.71875 9.6543C0.71875 14.752 4.91113 18.9443 10 18.9443ZM10 16.6328C6.1416 16.6328 3.03906 13.5215 3.03906 9.6543C3.03906 5.7959 6.13281 2.68457 10 2.68457C13.8584 2.68457 16.9697 5.7959 16.9697 9.6543C16.9785 13.5215 13.8672 16.6328 10 16.6328ZM7.29297 13.3018C7.58301 13.3018 7.81152 13.2139 7.99609 13.0205L10 11.0166L12.0127 13.0205C12.1973 13.2051 12.4258 13.3018 12.707 13.3018C13.2432 13.3018 13.6562 12.8887 13.6562 12.3525C13.6562 12.0977 13.5508 11.8691 13.3662 11.6934L11.3535 9.67188L13.375 7.6416C13.5596 7.44824 13.6562 7.22852 13.6562 6.98242C13.6562 6.44629 13.2432 6.0332 12.7158 6.0332C12.4346 6.0332 12.2148 6.12109 12.0215 6.31445L10 8.32715L7.9873 6.32324C7.80273 6.12988 7.58301 6.04199 7.29297 6.04199C6.76562 6.04199 6.35254 6.45508 6.35254 6.99121C6.35254 7.2373 6.44922 7.46582 6.63379 7.6416L8.65527 9.67188L6.63379 11.6934C6.44922 11.8691 6.35254 12.1064 6.35254 12.3525C6.35254 12.8887 6.76562 13.3018 7.29297 13.3018Z",fill:"currentColor"})),Tu=()=>a.createElement("svg",{fill:"none",height:"20",viewBox:"0 0 20 20",width:"20",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Success"),a.createElement("path",{d:"M10 19.4443C15.0977 19.4443 19.2812 15.252 19.2812 10.1543C19.2812 5.06543 15.0889 0.873047 10 0.873047C4.90234 0.873047 0.71875 5.06543 0.71875 10.1543C0.71875 15.252 4.91113 19.4443 10 19.4443ZM10 17.1328C6.1416 17.1328 3.03906 14.0215 3.03906 10.1543C3.03906 6.2959 6.13281 3.18457 10 3.18457C13.8584 3.18457 16.9697 6.2959 16.9697 10.1543C16.9785 14.0215 13.8672 17.1328 10 17.1328ZM9.07715 14.3379C9.4375 14.3379 9.7627 14.1533 9.97363 13.8369L13.7441 8.00977C13.8848 7.79883 13.9814 7.5791 13.9814 7.36816C13.9814 6.84961 13.5244 6.48926 13.0322 6.48926C12.707 6.48926 12.4258 6.66504 12.2148 7.0166L9.05957 12.0967L7.5918 10.2949C7.37207 10.0225 7.13477 9.9082 6.84473 9.9082C6.33496 9.9082 5.92188 10.3125 5.92188 10.8223C5.92188 11.0684 6.00098 11.2793 6.18555 11.5078L8.1543 13.8545C8.40918 14.1709 8.70801 14.3379 9.07715 14.3379Z",fill:"currentColor"})),Du=e=>{switch(e){case"pending":return Qe;case"confirmed":return Tu;case"failed":return Su;default:return Qe}};function Mu({tx:e}){const t=z(),n=Du(e.status),o=e.status==="failed"?"error":"accentColor",{chain:r}=$(),i=e.status==="confirmed"?"Confirmed":e.status==="failed"?"Failed":"Pending",s=Da(r);return a.createElement(a.Fragment,null,a.createElement(w,{...s?{as:"a",background:{hover:"profileForeground"},borderRadius:"menuButton",className:V({active:"shrink"}),href:`${s}/tx/${e.hash}`,rel:"noreferrer noopener",target:"_blank",transition:"default"}:{},color:"modalText",display:"flex",flexDirection:"row",justifyContent:"space-between",padding:"8",width:"full"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:t?"16":"14"},a.createElement(w,{color:o},a.createElement(n,null)),a.createElement(w,{display:"flex",flexDirection:"column",gap:t?"3":"1"},a.createElement(w,null,a.createElement(B,{color:"modalText",font:"body",size:t?"16":"14",weight:"bold"},e?.description)),a.createElement(w,null,a.createElement(B,{color:e.status==="pending"?"modalTextSecondary":o,font:"body",size:"14",weight:t?"medium":"regular"},i)))),s&&a.createElement(w,{alignItems:"center",color:"modalTextDim",display:"flex"},a.createElement(Ma,null))))}var Ru=3;function Ou({address:e}){const t=pa(),n=Iu(),{chain:o}=$(),r=Da(o),i=t.slice(0,Ru),s=i.length>0,c=z(),{appName:m}=b.useContext(lt),{i18n:g}=b.useContext(H);return a.createElement(a.Fragment,null,a.createElement(w,{display:"flex",flexDirection:"column",gap:"10",paddingBottom:"2",paddingTop:"16",paddingX:c?"8":"18"},s&&a.createElement(w,{paddingBottom:c?"4":"0",paddingTop:"8",paddingX:c?"12":"6"},a.createElement(w,{display:"flex",justifyContent:"space-between"},a.createElement(B,{color:"modalTextSecondary",size:c?"16":"14",weight:"semibold"},g.t("profile.transactions.recent.title")),a.createElement(w,{style:{marginBottom:-6,marginLeft:-10,marginRight:-10,marginTop:-6}},a.createElement(w,{as:"button",background:{hover:"profileForeground"},borderRadius:"actionButton",className:V({active:"shrink"}),onClick:n,paddingX:c?"8":"12",paddingY:c?"4":"5",transition:"default",type:"button"},a.createElement(B,{color:"modalTextSecondary",size:c?"16":"14",weight:"semibold"},g.t("profile.transactions.clear.label")))))),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},s?i.map(d=>a.createElement(Mu,{key:d.hash,tx:d})):a.createElement(a.Fragment,null,a.createElement(w,{padding:c?"12":"8"},a.createElement(B,{color:"modalTextDim",size:c?"16":"14",weight:c?"medium":"bold"},m?g.t("profile.transactions.description",{appName:m}):g.t("profile.transactions.description_fallback"))),c&&a.createElement(w,{background:"generalBorderDim",height:"1",marginX:"12",marginY:"8"})))),r&&a.createElement(w,{paddingBottom:"18",paddingX:c?"8":"18"},a.createElement(w,{alignItems:"center",as:"a",background:{hover:"profileForeground"},borderRadius:"menuButton",className:V({active:"shrink"}),color:"modalTextDim",display:"flex",flexDirection:"row",href:`${r}/address/${e}`,justifyContent:"space-between",paddingX:"8",paddingY:"12",rel:"noreferrer noopener",style:{willChange:"transform"},target:"_blank",transition:"default",width:"full",...c?{paddingLeft:"12"}:{}},a.createElement(B,{color:"modalText",font:"body",size:c?"16":"14",weight:c?"semibold":"bold"},g.t("profile.explorer.label")),a.createElement(Ma,null))))}function sr({action:e,icon:t,label:n,testId:o,url:r}){const i=z();return a.createElement(w,{...r?{as:"a",href:r,rel:"noreferrer noopener",target:"_blank"}:{as:"button",type:"button"},background:{base:"profileAction",...i?{}:{hover:"profileActionHover"}},borderRadius:"menuButton",boxShadow:"profileDetailsAction",className:V({active:"shrinkSm",hover:i?void 0:"grow"}),display:"flex",onClick:e,padding:i?"6":"8",style:{willChange:"transform"},testId:o,transition:"default",width:"full"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"1",justifyContent:"center",paddingTop:"2",width:"full"},a.createElement(w,{color:"modalText",height:"max"},t),a.createElement(w,null,a.createElement(B,{color:"modalText",size:i?"12":"13",weight:"semibold"},n))))}function Lu({address:e,ensAvatar:t,ensName:n,balance:o,onClose:r,onDisconnect:i}){const s=b.useContext(Fn),[c,m]=b.useState(!1),g=b.useCallback(()=>{e&&(navigator.clipboard.writeText(e),m(!0))},[e]);if(b.useEffect(()=>{if(c){const v=setTimeout(()=>{m(!1)},1500);return()=>clearTimeout(v)}},[c]),!e)return null;const d=n?Ta(n):Sa(e),h=o?.formatted,l=h?Ia(Number.parseFloat(h)):void 0,f="rk_profile_title",u=z(),{i18n:p}=b.useContext(H);return a.createElement(a.Fragment,null,a.createElement(w,{display:"flex",flexDirection:"column"},a.createElement(w,{background:"profileForeground",padding:"16"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:u?"16":"12",justifyContent:"center",margin:"8",style:{textAlign:"center"}},a.createElement(w,{style:{position:"absolute",right:16,top:16,willChange:"transform"}},a.createElement(Se,{onClose:r}))," ",a.createElement(w,{marginTop:u?"24":"0"},a.createElement(ra,{address:e,imageUrl:t,size:u?82:74})),a.createElement(w,{display:"flex",flexDirection:"column",gap:u?"4":"0",textAlign:"center"},a.createElement(w,{textAlign:"center"},a.createElement(B,{as:"h1",color:"modalText",id:f,size:u?"20":"18",weight:"heavy"},d)),!!o&&a.createElement(w,{textAlign:"center"},a.createElement(B,{as:"h1",color:"modalTextSecondary",id:f,size:u?"16":"14",weight:"semibold"},l," ",o.symbol)))),a.createElement(w,{display:"flex",flexDirection:"row",gap:"8",margin:"2",marginTop:"16"},a.createElement(sr,{action:g,icon:c?a.createElement(ju,null):a.createElement(_u,null),label:c?p.t("profile.copy_address.copied"):p.t("profile.copy_address.label")}),a.createElement(sr,{action:i,icon:a.createElement(Bu,null),label:p.t("profile.disconnect.label"),testId:"disconnect-button"}))),s&&a.createElement(a.Fragment,null,a.createElement(w,{background:"generalBorder",height:"1",marginTop:"-1"}),a.createElement(w,null,a.createElement(Ou,{address:e})))))}function Fu({onClose:e,open:t}){const{address:n}=$(),{balance:o,ensAvatar:r,ensName:i}=ua({address:n,includeBalance:t}),{disconnect:s}=En();return n?a.createElement(a.Fragment,null,n&&a.createElement(Dt,{onClose:e,open:t,titleId:"rk_account_modal_title"},a.createElement(Mt,{bottomSheetOnMobile:!0,padding:"0"},a.createElement(Lu,{address:n,ensAvatar:r,ensName:i,balance:o,onClose:e,onDisconnect:s})))):null}var Nu=({size:e})=>a.createElement("svg",{fill:"none",height:e,viewBox:"0 0 28 28",width:e,xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Disconnect"),a.createElement("path",{d:"M6.742 22.195h8.367c1.774 0 2.743-.968 2.743-2.758V16.11h-2.016v3.11c0 .625-.305.96-.969.96H6.984c-.664 0-.968-.335-.968-.96V7.984c0-.632.304-.968.968-.968h7.883c.664 0 .969.336.969.968v3.133h2.016v-3.36c0-1.78-.97-2.757-2.743-2.757H6.742C4.97 5 4 5.977 4 7.758v11.68c0 1.789.969 2.757 2.742 2.757Zm5.438-7.703h7.601l1.149-.07-.602.406-1.008.938a.816.816 0 0 0-.258.593c0 .407.313.782.758.782.227 0 .39-.086.547-.243l2.492-2.593c.235-.235.313-.47.313-.711 0-.242-.078-.477-.313-.719l-2.492-2.586c-.156-.156-.32-.25-.547-.25-.445 0-.758.367-.758.781 0 .227.094.446.258.594l1.008.945.602.407-1.149-.079H12.18a.904.904 0 0 0 0 1.805Z",fill:"currentColor"})),Wu="v9horb0",Qn=a.forwardRef(({children:e,currentlySelected:t=!1,onClick:n,testId:o,...r},i)=>{const s=z();return a.createElement(w,{as:"button",borderRadius:"menuButton",disabled:t,display:"flex",onClick:n,ref:i,testId:o,type:"button"},a.createElement(w,{borderRadius:"menuButton",className:[s?Wu:void 0,!t&&V({active:"shrink"})],padding:s?"8":"6",transition:"default",width:"full",...t?{background:"accentColor",borderColor:"selectedOptionBorder",borderStyle:"solid",borderWidth:"1",boxShadow:"selectedOption",color:"accentColorForeground"}:{background:{hover:"menuItemBackground"},color:"modalText",transition:"default"},...r},e))});Qn.displayName="MenuButton";var Pu=({chainId:e,currentChainId:t,switchChain:n,chainIconSize:o,isLoading:r,src:i,name:s,iconBackground:c,idx:m})=>{const g=z(),{i18n:d}=b.useContext(H),h=Te(),l=t===e;return a.createElement(b.Fragment,null,a.createElement(Qn,{currentlySelected:l,onClick:l?void 0:()=>n({chainId:e}),testId:`chain-option-${e}`},a.createElement(w,{fontFamily:"body",fontSize:"16",fontWeight:"bold"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",justifyContent:"space-between"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"4",height:o},i&&a.createElement(w,{height:"full",marginRight:"8"},a.createElement(Y,{alt:s,background:c,borderRadius:"full",height:o,src:i,width:o,testId:`chain-option-${e}-icon`})),a.createElement("div",null,s??s)),l&&a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",marginRight:"6"},a.createElement(B,{color:"accentColorForeground",size:"14",weight:"medium"},d.t("chains.connected")),a.createElement(w,{background:"connectionIndicator",borderColor:"selectedOptionBorder",borderRadius:"full",borderStyle:"solid",borderWidth:"1",height:"8",marginLeft:"8",width:"8"})),r&&a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",marginRight:"6"},a.createElement(B,{color:"modalText",size:"14",weight:"medium"},d.t("chains.confirm")),a.createElement(w,{background:"standby",borderRadius:"full",height:"8",marginLeft:"8",width:"8"}))))),g&&m<h.length-1&&a.createElement(w,{background:"generalBorderDim",height:"1",marginX:"8"}))},Uu=Pu,Qu="_18dqw9x0",qu="_18dqw9x1";function Vu({onClose:e,open:t}){const{chainId:n}=$(),{chains:o}=Rt(),[r,i]=b.useState(null),{switchChain:s}=Ai({mutation:{onMutate:({chainId:u})=>{i(u)},onSuccess:()=>{r&&i(null)},onError:()=>{r&&i(null)},onSettled:()=>{e()}}}),{i18n:c}=b.useContext(H),{disconnect:m}=En(),g="rk_chain_modal_title",d=z(),h=o.some(u=>u.id===n),l=d?"36":"28",f=Te();return n?a.createElement(Dt,{onClose:e,open:t,titleId:g},a.createElement(Mt,{bottomSheetOnMobile:!0,paddingBottom:"0"},a.createElement(w,{display:"flex",flexDirection:"column",gap:"14"},a.createElement(w,{display:"flex",flexDirection:"row",justifyContent:"space-between"},d&&a.createElement(w,{width:"30"}),a.createElement(w,{paddingBottom:"0",paddingLeft:"8",paddingTop:"4"},a.createElement(B,{as:"h1",color:"modalText",id:g,size:d?"20":"18",weight:"heavy"},c.t("chains.title"))),a.createElement(Se,{onClose:e})),!h&&a.createElement(w,{marginX:"8",textAlign:d?"center":"left"},a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},c.t("chains.wrong_network"))),a.createElement(w,{className:d?qu:Qu,display:"flex",flexDirection:"column",gap:"4",padding:"2",paddingBottom:"16"},f.map(({iconBackground:u,iconUrl:p,id:v,name:y},A)=>a.createElement(Uu,{key:v,chainId:v,currentChainId:n,switchChain:s,chainIconSize:l,isLoading:r===v,src:p,name:y,iconBackground:u,idx:A})),!h&&a.createElement(a.Fragment,null,a.createElement(w,{background:"generalBorderDim",height:"1",marginX:"8"}),a.createElement(Qn,{onClick:()=>m(),testId:"chain-option-disconnect"},a.createElement(w,{color:"error",fontFamily:"body",fontSize:"16",fontWeight:"bold"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",justifyContent:"space-between"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"4",height:l},a.createElement(w,{alignItems:"center",color:"error",height:l,justifyContent:"center",marginRight:"8"},a.createElement(Nu,{size:Number(l)})),a.createElement("div",null,c.t("chains.disconnect"))))))))))):null}function zu(e,t){const n={};for(const o of e){const r=t(o);r&&(n[r]||(n[r]=[]),n[r].push(o))}return n}var qn=({children:e,href:t})=>a.createElement(w,{as:"a",color:"accentColor",href:t,rel:"noreferrer",target:"_blank"},e),Vn=({children:e})=>a.createElement(B,{color:"modalTextSecondary",size:"12",weight:"medium"},e);function lr({compactModeEnabled:e=!1,getWallet:t}){const{disclaimer:n,learnMoreUrl:o}=b.useContext(lt),{i18n:r}=b.useContext(H);return a.createElement(a.Fragment,null,a.createElement(w,{alignItems:"center",color:"accentColor",display:"flex",flexDirection:"column",height:"full",justifyContent:"space-around"},a.createElement(w,{marginBottom:"10"},!e&&a.createElement(B,{color:"modalText",size:"18",weight:"heavy"},r.t("intro.title"))),a.createElement(w,{display:"flex",flexDirection:"column",gap:"32",justifyContent:"center",marginY:"20",style:{maxWidth:312}},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16"},a.createElement(w,{borderRadius:"6",height:"48",minWidth:"48",width:"48"},a.createElement(au,null)),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},r.t("intro.digital_asset.title")),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},r.t("intro.digital_asset.description")))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16"},a.createElement(w,{borderRadius:"6",height:"48",minWidth:"48",width:"48"},a.createElement(su,null)),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},r.t("intro.login.title")),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},r.t("intro.login.description"))))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",margin:"10"},a.createElement(oe,{label:r.t("intro.get.label"),onClick:t}),a.createElement(w,{as:"a",className:V({active:"shrink",hover:"grow"}),display:"block",href:o,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},a.createElement(B,{color:"accentColor",size:"14",weight:"bold"},r.t("intro.learn_more.label")))),n&&!e&&a.createElement(w,{marginBottom:"8",marginTop:"12",textAlign:"center"},a.createElement(n,{Link:qn,Text:Vn}))))}var Ra=()=>a.createElement("svg",{fill:"none",height:"17",viewBox:"0 0 11 17",width:"11",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Back"),a.createElement("path",{d:"M0.99707 8.6543C0.99707 9.08496 1.15527 9.44531 1.51562 9.79688L8.16016 16.3096C8.43262 16.5732 8.74902 16.7051 9.13574 16.7051C9.90918 16.7051 10.5508 16.0811 10.5508 15.3076C10.5508 14.9121 10.3838 14.5605 10.0938 14.2705L4.30176 8.64551L10.0938 3.0293C10.3838 2.74805 10.5508 2.3877 10.5508 2.00098C10.5508 1.23633 9.90918 0.603516 9.13574 0.603516C8.74902 0.603516 8.43262 0.735352 8.16016 0.999023L1.51562 7.51172C1.15527 7.85449 1.00586 8.21484 0.99707 8.6543Z",fill:"currentColor"})),Hu=()=>a.createElement("svg",{fill:"none",height:"12",viewBox:"0 0 8 12",width:"8",xmlns:"http://www.w3.org/2000/svg"},a.createElement("title",null,"Info"),a.createElement("path",{d:"M3.64258 7.99609C4.19336 7.99609 4.5625 7.73828 4.68555 7.24609C4.69141 7.21094 4.70312 7.16406 4.70898 7.13477C4.80859 6.60742 5.05469 6.35547 6.04492 5.76367C7.14648 5.10156 7.67969 4.3457 7.67969 3.24414C7.67969 1.39844 6.17383 0.255859 3.95898 0.255859C2.32422 0.255859 1.05859 0.894531 0.548828 1.86719C0.396484 2.14844 0.320312 2.44727 0.320312 2.74023C0.314453 3.37305 0.742188 3.79492 1.42188 3.79492C1.91406 3.79492 2.33594 3.54883 2.53516 3.11523C2.78711 2.47656 3.23242 2.21289 3.83594 2.21289C4.55664 2.21289 5.10742 2.65234 5.10742 3.29102C5.10742 3.9707 4.7793 4.29883 3.81836 4.87891C3.02148 5.36523 2.50586 5.92773 2.50586 6.76562V6.90039C2.50586 7.55664 2.96289 7.99609 3.64258 7.99609ZM3.67188 11.4473C4.42773 11.4473 5.04297 10.8672 5.04297 10.1406C5.04297 9.41406 4.42773 8.83984 3.67188 8.83984C2.91602 8.83984 2.30664 9.41406 2.30664 10.1406C2.30664 10.8672 2.91602 11.4473 3.67188 11.4473Z",fill:"currentColor"})),Ku=({"aria-label":e="Info",onClick:t})=>{const n=z();return a.createElement(w,{alignItems:"center","aria-label":e,as:"button",background:"closeButtonBackground",borderColor:"actionButtonBorder",borderRadius:"full",borderStyle:"solid",borderWidth:n?"0":"1",className:V({active:"shrinkSm",hover:"growLg"}),color:"closeButton",display:"flex",height:n?"30":"28",justifyContent:"center",onClick:t,style:{willChange:"transform"},transition:"default",type:"button",width:n?"30":"28"},a.createElement(Hu,null))},Oa=e=>{const t=b.useRef(null),n=b.useContext(ga),o=Pt(e);return b.useEffect(()=>{if(n&&t.current&&o)return Ju(t.current,o)},[n,o]),t},Gu=()=>{const e="_rk_coolMode",t=document.getElementById(e);if(t)return t;const n=document.createElement("div");return n.setAttribute("id",e),n.setAttribute("style",["overflow:hidden","position:fixed","height:100%","top:0","left:0","right:0","bottom:0","pointer-events:none","z-index:2147483647"].join(";")),document.body.appendChild(n),n},cr=0;function Ju(e,t){cr++;const n=[15,20,25,35,45],o=35;let r=[],i=!1,s=0,c=0;const m=Gu();function g(){const C=n[Math.floor(Math.random()*n.length)],x=Math.random()*10,j=Math.random()*25,I=Math.random()*360,D=Math.random()*35*(Math.random()<=.5?-1:1),L=c-C/2,P=s-C/2,Z=Math.random()<=.5?-1:1,G=document.createElement("div");G.innerHTML=`<img src="${t}" width="${C}" height="${C}" style="border-radius: 25%">`,G.setAttribute("style",["position:absolute","will-change:transform",`top:${L}px`,`left:${P}px`,`transform:rotate(${I}deg)`].join(";")),m.appendChild(G),r.push({direction:Z,element:G,left:P,size:C,speedHorz:x,speedUp:j,spinSpeed:D,spinVal:I,top:L})}function d(){for(const C of r)C.left=C.left-C.speedHorz*C.direction,C.top=C.top-C.speedUp,C.speedUp=Math.min(C.size,C.speedUp-1),C.spinVal=C.spinVal+C.spinSpeed,C.top>=Math.max(window.innerHeight,document.body.clientHeight)+C.size&&(r=r.filter(x=>x!==C),C.element.remove()),C.element.setAttribute("style",["position:absolute","will-change:transform",`top:${C.top}px`,`left:${C.left}px`,`transform:rotate(${C.spinVal}deg)`].join(";"))}let h;function l(){i&&r.length<o&&g(),d(),h=requestAnimationFrame(l)}l();const f="ontouchstart"in window||navigator.msMaxTouchPoints,u=f?"touchstart":"mousedown",p=f?"touchend":"mouseup",v=f?"touchmove":"mousemove",y=C=>{"touches"in C?(s=C.touches?.[0].clientX,c=C.touches?.[0].clientY):(s=C.clientX,c=C.clientY)},A=C=>{y(C),i=!0},E=()=>{i=!1};return e.addEventListener(v,y,{passive:!1}),e.addEventListener(u,A),e.addEventListener(p,E),e.addEventListener("mouseleave",E),()=>{e.removeEventListener(v,y),e.removeEventListener(u,A),e.removeEventListener(p,E),e.removeEventListener("mouseleave",E);const C=setInterval(()=>{h&&r.length===0&&(cancelAnimationFrame(h),clearInterval(C),--cr===0&&m.remove())},500)}}var Yu="g5kl0l0",La=({as:e="button",currentlySelected:t=!1,iconBackground:n,iconUrl:o,name:r,onClick:i,ready:s,recent:c,testId:m,isRainbowKitConnector:g,...d})=>{const h=Oa(o),[l,f]=a.useState(!1),{i18n:u}=a.useContext(H);return a.createElement(w,{display:"flex",flexDirection:"column",onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),ref:h},a.createElement(w,{as:e,borderRadius:"menuButton",borderStyle:"solid",borderWidth:"1",className:t?void 0:[Yu,V({active:"shrink"})],disabled:t,onClick:i,padding:"5",style:{willChange:"transform"},testId:m,transition:"default",width:"full",...t?{background:"accentColor",borderColor:"selectedOptionBorder",boxShadow:"selectedWallet"}:{background:{hover:"menuItemBackground"}},...d},a.createElement(w,{color:t?"accentColorForeground":"modalText",disabled:!s,fontFamily:"body",fontSize:"16",fontWeight:"bold",transition:"default"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"12"},a.createElement(Y,{background:n,...!l&&g?{borderColor:"actionButtonBorder"}:{},useAsImage:!g,borderRadius:"6",height:"28",src:o,width:"28"}),a.createElement(w,null,a.createElement(w,{style:{marginTop:c?-2:void 0},maxWidth:"200"},r),c&&a.createElement(B,{color:t?"accentColorForeground":"accentColor",size:"12",style:{lineHeight:1,marginTop:-1},weight:"medium"},u.t("connect.recent")))))))};La.displayName="ModalSelection";var zn="rk-latest-id";function Xu(){return typeof localStorage<"u"&&localStorage.getItem(zn)||""}function Fa(e){localStorage.setItem(zn,e)}function Zu(){localStorage.removeItem(zn)}var ln=(e,t=1)=>{let n=e.replace("#","");n.length===3&&(n=`${n[0]}${n[0]}${n[1]}${n[1]}${n[2]}${n[2]}`);const o=Number.parseInt(n.substring(0,2),16),r=Number.parseInt(n.substring(2,4),16),i=Number.parseInt(n.substring(4,6),16);return t>1&&t<=100&&(t=t/100),`rgba(${o},${r},${i},${t})`},$u=e=>e?[ln(e,.2),ln(e,.14),ln(e,.1)]:null,ed=e=>/^#([0-9a-f]{3}){1,2}$/i.test(e),Na=async()=>(await k(async()=>{const{default:e}=await import("./connect-UA7M4XW6-IY3X6Bmr.js");return{default:e}},[])).default,td=()=>we(Na),nd=()=>a.createElement(Y,{background:"#515a70",borderColor:"generalBorder",borderRadius:"10",height:"48",src:Na,width:"48"}),Wa=async()=>(await k(async()=>{const{default:e}=await import("./create-FASO7PVG-D_rvSpre.js");return{default:e}},[])).default,Pa=()=>we(Wa),od=()=>a.createElement(Y,{background:"#e3a5e8",borderColor:"generalBorder",borderRadius:"10",height:"48",src:Wa,width:"48"}),Ua=async()=>(await k(async()=>{const{default:e}=await import("./refresh-S4T5V5GX-CwqIaaxK.js");return{default:e}},[])).default,rd=()=>we(Ua),ad=()=>a.createElement(Y,{background:"#515a70",borderColor:"generalBorder",borderRadius:"10",height:"48",src:Ua,width:"48"}),Qa=async()=>(await k(async()=>{const{default:e}=await import("./scan-4UYSQ56Q-CjMz6-XC.js");return{default:e}},[])).default,qa=()=>we(Qa),id=()=>a.createElement(Y,{background:"#515a70",borderColor:"generalBorder",borderRadius:"10",height:"48",src:Qa,width:"48"}),sd="_1vwt0cg0",ld="_1vwt0cg2 ju367v7a ju367v7v",cd="_1vwt0cg3",ud="_1vwt0cg4";function Va({ecc:e="medium",logoBackground:t,logoSize:n=50,logoUrl:o,size:r=200,uri:i}){const c=r-Number.parseInt("20",10)*2,m=Pt(o);return a.createElement(w,{borderColor:"generalBorder",borderRadius:"menuButton",borderStyle:"solid",borderWidth:"1",className:sd,padding:"20",width:"max"},a.createElement(w,{style:{height:c,userSelect:"none",width:c},userSelect:"none"},a.createElement(me.Root,{errorCorrection:e,size:c,value:i},a.createElement(me.Cells,{radius:1}),a.createElement(me.Finder,{radius:.25}),m&&a.createElement(me.Arena,null,a.createElement("img",{alt:"Wallet Logo",src:m,style:{objectFit:"cover",height:"88%",width:"88%",borderRadius:"22.5%",backgroundColor:t}})))))}var za=async()=>{switch(Wn()){case"Arc":return(await k(async()=>{const{default:t}=await import("./Arc-VDBY7LNS-BChRXCXW.js");return{default:t}},[])).default;case"Brave":return(await k(async()=>{const{default:t}=await import("./Brave-BRAKJXDS-mq-Xo37j.js");return{default:t}},[])).default;case"Chrome":return(await k(async()=>{const{default:t}=await import("./Chrome-65Q5P54Y-DR9MQEVr.js");return{default:t}},[])).default;case"Edge":return(await k(async()=>{const{default:t}=await import("./Edge-XSPUTORV-DEoZslQE.js");return{default:t}},[])).default;case"Firefox":return(await k(async()=>{const{default:t}=await import("./Firefox-AAHGJQIP-Bp_Hm04m.js");return{default:t}},[])).default;case"Opera":return(await k(async()=>{const{default:t}=await import("./Opera-KQZLSACL-Cwv5MDFy.js");return{default:t}},[])).default;case"Safari":return(await k(async()=>{const{default:t}=await import("./Safari-ZPL37GXR-C4Ggg6rz.js");return{default:t}},[])).default;default:return(await k(async()=>{const{default:t}=await import("./Browser-76IHF3Y2-BMhRaC5Z.js");return{default:t}},[])).default}},dd=()=>we(za),Ha=async()=>{switch(Un()){case"Windows":return(await k(async()=>{const{default:t}=await import("./Windows-PPTHQER6-BlyV2p7Y.js");return{default:t}},[])).default;case"macOS":return(await k(async()=>{const{default:t}=await import("./Macos-MW4AE7LN-Vvm8Drw3.js");return{default:t}},[])).default;case"Linux":return(await k(async()=>{const{default:t}=await import("./Linux-OO4TNCLJ-B0aw93n9.js");return{default:t}},[])).default;default:return(await k(async()=>{const{default:t}=await import("./Linux-OO4TNCLJ-B0aw93n9.js");return{default:t}},[])).default}},fd=()=>we(Ha);function pd({getWalletDownload:e,compactModeEnabled:t}){const o=qe().filter(i=>i.isRainbowKitConnector).splice(0,5),{i18n:r}=b.useContext(H);return a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",marginTop:"18",width:"full"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"28",height:"full",width:"full"},o?.filter(i=>i.extensionDownloadUrl||i.desktopDownloadUrl||i.qrCode&&i.downloadUrls?.qrCode).map(i=>{const{downloadUrls:s,iconBackground:c,iconUrl:m,id:g,name:d,qrCode:h}=i,l=s?.qrCode&&h,f=!!i.extensionDownloadUrl,u=s?.qrCode&&f,p=s?.qrCode&&!!i.desktopDownloadUrl;return a.createElement(w,{alignItems:"center",display:"flex",gap:"16",justifyContent:"space-between",key:i.id,width:"full"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16"},a.createElement(Y,{background:c,borderColor:"actionButtonBorder",borderRadius:"10",height:"48",src:m,width:"48"}),a.createElement(w,{display:"flex",flexDirection:"column",gap:"2"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},d),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},u?r.t("get.mobile_and_extension.description"):p?r.t("get.mobile_and_desktop.description"):l?r.t("get.mobile.description"):f?r.t("get.extension.description"):null))),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},a.createElement(oe,{label:r.t("get.action.label"),onClick:()=>e(g),type:"secondary"})))})),a.createElement(w,{alignItems:"center",borderRadius:"10",display:"flex",flexDirection:"column",gap:"8",justifyContent:"space-between",marginBottom:"4",paddingY:"8",style:{maxWidth:275,textAlign:"center"}},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},r.t("get.looking_for.title")),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},t?r.t("get.looking_for.desktop.compact_description"):r.t("get.looking_for.desktop.wide_description"))))}var cn="44";function hd({changeWalletStep:e,compactModeEnabled:t,connectionError:n,onClose:o,qrCodeUri:r,reconnect:i,wallet:s}){const{downloadUrls:c,iconBackground:m,iconUrl:g,name:d,qrCode:h,ready:l,showWalletConnectModal:f,getDesktopUri:u}=s,p=!!u,v=Nn(),{i18n:y}=b.useContext(H),A=!!s.extensionDownloadUrl,E=c?.qrCode&&A,C=c?.qrCode&&!!s.desktopDownloadUrl,x=h&&r,j=async()=>{const P=await u?.();window.open(P,v?"_blank":"_self")},I=f?{description:t?y.t("connect.walletconnect.description.compact"):y.t("connect.walletconnect.description.full"),label:y.t("connect.walletconnect.open.label"),onClick:()=>{o(),f()}}:x?{description:y.t("connect.secondary_action.get.description",{wallet:d}),label:y.t("connect.secondary_action.get.label"),onClick:()=>e(E||C?"DOWNLOAD_OPTIONS":"DOWNLOAD")}:null,{width:D}=wa(),L=D&&D<768;return b.useEffect(()=>{dd(),fd()},[]),a.createElement(w,{display:"flex",flexDirection:"column",height:"full",width:"full"},x?a.createElement(w,{alignItems:"center",display:"flex",height:"full",justifyContent:"center"},a.createElement(Va,{logoBackground:m,logoSize:t?60:72,logoUrl:g,size:t?318:L?Math.max(280,Math.min(D-308,382)):382,uri:r})):a.createElement(w,{alignItems:"center",display:"flex",justifyContent:"center",style:{flexGrow:1}},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"8"},a.createElement(w,{borderRadius:"10",height:cn,overflow:"hidden"},a.createElement(Y,{useAsImage:!s.isRainbowKitConnector,height:cn,src:g,width:cn})),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"4",paddingX:"32",style:{textAlign:"center"}},a.createElement(B,{color:"modalText",size:"18",weight:"bold"},l?y.t("connect.status.opening",{wallet:d}):A?y.t("connect.status.not_installed",{wallet:d}):y.t("connect.status.not_available",{wallet:d})),!l&&A?a.createElement(w,{paddingTop:"20"},a.createElement(oe,{href:s.extensionDownloadUrl,label:y.t("connect.secondary_action.install.label"),type:"secondary"})):null,l&&!x&&a.createElement(a.Fragment,null,a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",justifyContent:"center"},a.createElement(B,{color:"modalTextSecondary",size:"14",textAlign:"center",weight:"medium"},y.t("connect.status.confirm"))),a.createElement(w,{alignItems:"center",color:"modalText",display:"flex",flexDirection:"row",height:"32",marginTop:"8"},n?a.createElement(oe,{label:y.t("connect.secondary_action.retry.label"),onClick:async()=>{p&&j(),i(s)}}):a.createElement(w,{color:"modalTextSecondary"},a.createElement(Qe,null))))))),a.createElement(w,{alignItems:"center",borderRadius:"10",display:"flex",flexDirection:"row",gap:"8",height:"28",justifyContent:"space-between",marginTop:"12"},l&&I&&a.createElement(a.Fragment,null,a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},I.description),a.createElement(oe,{label:I.label,onClick:I.onClick,type:"secondary"}))))}var un=({actionLabel:e,description:t,iconAccent:n,iconBackground:o,iconUrl:r,isCompact:i,onAction:s,title:c,url:m,variant:g})=>{const d=g==="browser",h=!d&&n&&$u(n);return a.createElement(w,{alignItems:"center",borderRadius:"13",display:"flex",justifyContent:"center",overflow:"hidden",paddingX:i?"18":"44",position:"relative",style:{flex:1,isolation:"isolate"},width:"full"},a.createElement(w,{borderColor:"actionButtonBorder",borderRadius:"13",borderStyle:"solid",borderWidth:"1",style:{bottom:"0",left:"0",position:"absolute",right:"0",top:"0",zIndex:1}}),d&&a.createElement(w,{background:"downloadTopCardBackground",height:"full",position:"absolute",style:{zIndex:0},width:"full"},a.createElement(w,{display:"flex",flexDirection:"row",justifyContent:"space-between",style:{bottom:"0",filter:"blur(20px)",left:"0",position:"absolute",right:"0",top:"0",transform:"translate3d(0, 0, 0)"}},a.createElement(w,{style:{filter:"blur(100px)",marginLeft:-27,marginTop:-20,opacity:.6,transform:"translate3d(0, 0, 0)"}},a.createElement(Y,{borderRadius:"full",height:"200",src:r,width:"200"})),a.createElement(w,{style:{filter:"blur(100px)",marginRight:0,marginTop:105,opacity:.6,overflow:"auto",transform:"translate3d(0, 0, 0)"}},a.createElement(Y,{borderRadius:"full",height:"200",src:r,width:"200"})))),!d&&h&&a.createElement(w,{background:"downloadBottomCardBackground",style:{bottom:"0",left:"0",position:"absolute",right:"0",top:"0"}},a.createElement(w,{position:"absolute",style:{background:`radial-gradient(50% 50% at 50% 50%, ${h[0]} 0%, ${h[1]} 25%, rgba(0,0,0,0) 100%)`,height:564,left:-215,top:-197,transform:"translate3d(0, 0, 0)",width:564}}),a.createElement(w,{position:"absolute",style:{background:`radial-gradient(50% 50% at 50% 50%, ${h[2]} 0%, rgba(0, 0, 0, 0) 100%)`,height:564,left:-1,top:-76,transform:"translate3d(0, 0, 0)",width:564}})),a.createElement(w,{alignItems:"flex-start",display:"flex",flexDirection:"row",gap:"24",height:"max",justifyContent:"center",style:{zIndex:1}},a.createElement(w,null,a.createElement(Y,{height:"60",src:r,width:"60",...o?{background:o,borderColor:"generalBorder",borderRadius:"10"}:null})),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4",style:{flex:1},width:"full"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},c),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},t),a.createElement(w,{marginTop:"14",width:"max"},a.createElement(oe,{href:m,label:e,onClick:s,size:"medium"})))))};function md({changeWalletStep:e,wallet:t}){const n=Wn(),o=Un(),i=b.useContext(Qt)==="compact",{desktop:s,desktopDownloadUrl:c,extension:m,extensionDownloadUrl:g,mobileDownloadUrl:d}=t,{i18n:h}=b.useContext(H);return b.useEffect(()=>{Pa(),qa(),rd(),td()},[]),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"24",height:"full",marginBottom:"8",marginTop:"4",width:"full"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"8",height:"full",justifyContent:"center",width:"full"},g&&a.createElement(un,{actionLabel:h.t("get_options.extension.download.label",{browser:n}),description:h.t("get_options.extension.description"),iconUrl:za,isCompact:i,onAction:()=>e(m?.instructions?"INSTRUCTIONS_EXTENSION":"CONNECT"),title:h.t("get_options.extension.title",{wallet:t.name,browser:n}),url:g,variant:"browser"}),c&&a.createElement(un,{actionLabel:h.t("get_options.desktop.download.label",{platform:o}),description:h.t("get_options.desktop.description"),iconUrl:Ha,isCompact:i,onAction:()=>e(s?.instructions?"INSTRUCTIONS_DESKTOP":"CONNECT"),title:h.t("get_options.desktop.title",{wallet:t.name,platform:o}),url:c,variant:"desktop"}),d&&a.createElement(un,{actionLabel:h.t("get_options.mobile.download.label",{wallet:t.name}),description:h.t("get_options.mobile.description"),iconAccent:t.iconAccent,iconBackground:t.iconBackground,iconUrl:t.iconUrl,isCompact:i,onAction:()=>{e("DOWNLOAD")},title:h.t("get_options.mobile.title",{wallet:t.name}),variant:"app"})))}function gd({changeWalletStep:e,wallet:t}){const{downloadUrls:n,qrCode:o}=t,{i18n:r}=b.useContext(H);return b.useEffect(()=>{Pa(),qa()},[]),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"24",height:"full",width:"full"},a.createElement(w,{style:{maxWidth:220,textAlign:"center"}},a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"semibold"},r.t("get_mobile.description"))),a.createElement(w,{height:"full"},n?.qrCode?a.createElement(Va,{logoSize:0,size:268,uri:n.qrCode}):null),a.createElement(w,{alignItems:"center",borderRadius:"10",display:"flex",flexDirection:"row",gap:"8",height:"34",justifyContent:"space-between",marginBottom:"12",paddingY:"8"},a.createElement(oe,{label:r.t("get_mobile.continue.label"),onClick:()=>e(o?.instructions?"INSTRUCTIONS_MOBILE":"CONNECT")})))}var Hn={connect:()=>a.createElement(nd,null),create:()=>a.createElement(od,null),install:e=>a.createElement(Y,{background:e.iconBackground,borderColor:"generalBorder",borderRadius:"10",height:"48",src:e.iconUrl,width:"48"}),refresh:()=>a.createElement(ad,null),scan:()=>a.createElement(id,null)};function wd({connectWallet:e,wallet:t}){const{i18n:n}=b.useContext(H);return a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",width:"full"},a.createElement(w,{display:"flex",flexDirection:"column",gap:"28",height:"full",justifyContent:"center",paddingY:"32",style:{maxWidth:320}},t?.qrCode?.instructions?.steps.map((o,r)=>a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16",key:r},a.createElement(w,{borderRadius:"10",height:"48",minWidth:"48",overflow:"hidden",position:"relative",width:"48"},Hn[o.step]?.(t)),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},n.t(o.title,void 0,{rawKeyIfTranslationMissing:!0})),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},n.t(o.description,void 0,{rawKeyIfTranslationMissing:!0})))))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",marginBottom:"16"},a.createElement(oe,{label:n.t("get_instructions.mobile.connect.label"),onClick:()=>e(t)}),a.createElement(w,{as:"a",className:V({active:"shrink",hover:"grow"}),display:"block",href:t?.qrCode?.instructions?.learnMoreUrl,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},a.createElement(B,{color:"accentColor",size:"14",weight:"bold"},n.t("get_instructions.mobile.learn_more.label")))))}function vd({wallet:e}){const{i18n:t}=b.useContext(H);return a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",width:"full"},a.createElement(w,{display:"flex",flexDirection:"column",gap:"28",height:"full",justifyContent:"center",paddingY:"32",style:{maxWidth:320}},e?.extension?.instructions?.steps.map((n,o)=>a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16",key:o},a.createElement(w,{borderRadius:"10",height:"48",minWidth:"48",overflow:"hidden",position:"relative",width:"48"},Hn[n.step]?.(e)),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},t.t(n.title,void 0,{rawKeyIfTranslationMissing:!0})),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},t.t(n.description,void 0,{rawKeyIfTranslationMissing:!0})))))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",marginBottom:"16"},a.createElement(oe,{label:t.t("get_instructions.extension.refresh.label"),onClick:window.location.reload.bind(window.location)}),a.createElement(w,{as:"a",className:V({active:"shrink",hover:"grow"}),display:"block",href:e?.extension?.instructions?.learnMoreUrl,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},a.createElement(B,{color:"accentColor",size:"14",weight:"bold"},t.t("get_instructions.extension.learn_more.label")))))}function bd({connectWallet:e,wallet:t}){const{i18n:n}=b.useContext(H);return a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",width:"full"},a.createElement(w,{display:"flex",flexDirection:"column",gap:"28",height:"full",justifyContent:"center",paddingY:"32",style:{maxWidth:320}},t?.desktop?.instructions?.steps.map((o,r)=>a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16",key:r},a.createElement(w,{borderRadius:"10",height:"48",minWidth:"48",overflow:"hidden",position:"relative",width:"48"},Hn[o.step]?.(t)),a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},a.createElement(B,{color:"modalText",size:"14",weight:"bold"},n.t(o.title,void 0,{rawKeyIfTranslationMissing:!0})),a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},n.t(o.description,void 0,{rawKeyIfTranslationMissing:!0})))))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",marginBottom:"16"},a.createElement(oe,{label:n.t("get_instructions.desktop.connect.label"),onClick:()=>e(t)}),a.createElement(w,{as:"a",className:V({active:"shrink",hover:"grow"}),display:"block",href:t?.desktop?.instructions?.learnMoreUrl,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},a.createElement(B,{color:"accentColor",size:"14",weight:"bold"},n.t("get_instructions.desktop.learn_more.label")))))}function Ka({onClose:e}){const t="rk_connect_title",[n,o]=b.useState(),[r,i]=b.useState(),[s,c]=b.useState(),m=!!r?.qrCode&&s,[g,d]=b.useState(!1),l=b.useContext(Qt)===ct.COMPACT,{disclaimer:f}=b.useContext(lt),{i18n:u}=b.useContext(H),p=Nn(),v=b.useRef(!1),{connector:y}=b.useContext(Ve),E=qe(!y).filter(M=>M.ready||!!M.extensionDownloadUrl).sort((M,q)=>M.groupIndex-q.groupIndex),C=qe(),x=zu(E,M=>M.groupName),j=["Recommended","Other","Popular","More","Others","Installed"];b.useEffect(()=>{y&&!v.current&&(Q("CONNECT"),P(y),v.current=!0)},[y]);const I=M=>{d(!1),M.ready&&M?.connect?.()?.catch(()=>{d(!0)})},D=async M=>{const q=E.find(X=>M.id===X.id);q?.getDesktopUri&&setTimeout(async()=>{const X=await q?.getDesktopUri?.();X&&window.open(X,p?"_blank":"_self")},0)},L=async M=>{const q=E.find(J=>M.id===J.id),X=await q?.getQrCodeUri?.();c(X),setTimeout(()=>{i(q),Q("CONNECT")},X?0:50)},P=async M=>{Fa(M.id),M.ready&&(L(M),D(M)),I(M),o(M.id),M.ready||(i(M),Q(M?.extensionDownloadUrl?"DOWNLOAD_OPTIONS":"CONNECT"))},Z=M=>{const q=C.find(dt=>M===dt.id),X=q?.downloadUrls?.qrCode,J=!!q?.desktopDownloadUrl,xe=!!q?.extensionDownloadUrl;i(q),Q(X&&(xe||J)?"DOWNLOAD_OPTIONS":X?"DOWNLOAD":J?"INSTRUCTIONS_DESKTOP":"INSTRUCTIONS_EXTENSION")},G=()=>{o(void 0),i(void 0),c(void 0)},Q=(M,q=!1)=>{q&&M==="GET"&&re==="GET"?G():!q&&M==="GET"?ve("GET"):!q&&M==="CONNECT"&&ve("CONNECT"),ue(M)},[re,ve]=b.useState("NONE"),[te,ue]=b.useState("NONE");let F=null,ae=null,ie=null,Ee;b.useEffect(()=>{d(!1)},[te,r]);const He=!!(!!r?.extensionDownloadUrl&&r?.mobileDownloadUrl);switch(te){case"NONE":F=a.createElement(lr,{getWallet:()=>Q("GET")});break;case"LEARN_COMPACT":F=a.createElement(lr,{compactModeEnabled:l,getWallet:()=>Q("GET")}),ae=u.t("intro.title"),ie="NONE";break;case"GET":F=a.createElement(pd,{getWalletDownload:Z,compactModeEnabled:l}),ae=u.t("get.title"),ie=l?"LEARN_COMPACT":"NONE";break;case"CONNECT":F=r&&a.createElement(hd,{changeWalletStep:Q,compactModeEnabled:l,connectionError:g,onClose:e,qrCodeUri:s,reconnect:I,wallet:r}),ae=m&&(r.name==="WalletConnect"?u.t("connect_scan.fallback_title"):u.t("connect_scan.title",{wallet:r.name})),ie=l?y?null:"NONE":null,Ee=l?y?()=>{}:G:()=>{};break;case"DOWNLOAD_OPTIONS":F=r&&a.createElement(md,{changeWalletStep:Q,wallet:r}),ae=r&&u.t("get_options.short_title",{wallet:r.name}),ie=y?"CONNECT":l?"NONE":re;break;case"DOWNLOAD":F=r&&a.createElement(gd,{changeWalletStep:Q,wallet:r}),ae=r&&u.t("get_mobile.title",{wallet:r.name}),ie=He?"DOWNLOAD_OPTIONS":re;break;case"INSTRUCTIONS_MOBILE":F=r&&a.createElement(wd,{connectWallet:P,wallet:r}),ae=r&&u.t("get_options.title",{wallet:l&&r.shortName||r.name}),ie="DOWNLOAD";break;case"INSTRUCTIONS_EXTENSION":F=r&&a.createElement(vd,{wallet:r}),ae=r&&u.t("get_options.title",{wallet:l&&r.shortName||r.name}),ie="DOWNLOAD_OPTIONS";break;case"INSTRUCTIONS_DESKTOP":F=r&&a.createElement(bd,{connectWallet:P,wallet:r}),ae=r&&u.t("get_options.title",{wallet:l&&r.shortName||r.name}),ie="DOWNLOAD_OPTIONS";break}return a.createElement(w,{display:"flex",flexDirection:"row",style:{maxHeight:l?468:504}},(l?te==="NONE":!0)&&a.createElement(w,{className:l?ud:cd,display:"flex",flexDirection:"column",marginTop:"16"},a.createElement(w,{display:"flex",justifyContent:"space-between"},l&&f&&a.createElement(w,{marginLeft:"16",width:"28"},a.createElement(Ku,{onClick:()=>Q("LEARN_COMPACT")})),l&&!f&&a.createElement(w,{marginLeft:"16",width:"28"}),a.createElement(w,{marginLeft:l?"0":"6",paddingBottom:"8",paddingTop:"2",paddingX:"18"},a.createElement(B,{as:"h1",color:"modalText",id:t,size:"18",weight:"heavy",testId:"connect-header-label"},u.t("connect.title"))),l&&a.createElement(w,{marginRight:"16"},a.createElement(Se,{onClose:e}))),a.createElement(w,{className:ld,paddingBottom:"18"},Object.entries(x).map(([M,q],X)=>q.length>0&&a.createElement(b.Fragment,{key:X},M?a.createElement(w,{marginBottom:"8",marginTop:"16",marginX:"6"},a.createElement(B,{color:M==="Installed"?"accentColor":"modalTextSecondary",size:"14",weight:"bold"},j.includes(M)?u.t(`connector_group.${M.toLowerCase()}`):M)):null,a.createElement(w,{display:"flex",flexDirection:"column",gap:"4"},q.map(J=>a.createElement(La,{currentlySelected:J.id===n,iconBackground:J.iconBackground,iconUrl:J.iconUrl,key:J.id,name:J.name,onClick:()=>P(J),ready:J.ready,recent:J.recent,testId:`wallet-option-${J.id}`,isRainbowKitConnector:J.isRainbowKitConnector})))))),l&&a.createElement(a.Fragment,null,a.createElement(w,{background:"generalBorder",height:"1",marginTop:"-1"}),f?a.createElement(w,{paddingX:"24",paddingY:"16",textAlign:"center"},a.createElement(f,{Link:qn,Text:Vn})):a.createElement(w,{alignItems:"center",display:"flex",justifyContent:"space-between",paddingX:"24",paddingY:"16"},a.createElement(w,{paddingY:"4"},a.createElement(B,{color:"modalTextSecondary",size:"14",weight:"medium"},u.t("connect.new_to_ethereum.description"))),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"4",justifyContent:"center"},a.createElement(w,{className:V({active:"shrink",hover:"grow"}),cursor:"pointer",onClick:()=>Q("LEARN_COMPACT"),paddingY:"4",style:{willChange:"transform"},transition:"default"},a.createElement(B,{color:"accentColor",size:"14",weight:"bold"},u.t("connect.new_to_ethereum.learn_more.label"))))))),(l?te!=="NONE":!0)&&a.createElement(a.Fragment,null,!l&&a.createElement(w,{background:"generalBorder",minWidth:"1",width:"1"}),a.createElement(w,{display:"flex",flexDirection:"column",margin:"16",style:{flexGrow:1}},a.createElement(w,{alignItems:"center",display:"flex",justifyContent:"space-between",marginBottom:"12"},a.createElement(w,{width:"28"},ie&&a.createElement(w,{as:"button",className:V({active:"shrinkSm",hover:"growLg"}),color:"accentColor",onClick:()=>{ie&&Q(ie,!0),Ee?.()},paddingX:"8",paddingY:"4",style:{boxSizing:"content-box",height:17,willChange:"transform"},transition:"default",type:"button"},a.createElement(Ra,null))),a.createElement(w,{display:"flex",justifyContent:"center",style:{flexGrow:1}},ae&&a.createElement(B,{color:"modalText",size:"18",textAlign:"center",weight:"heavy"},ae)),a.createElement(Se,{onClose:e})),a.createElement(w,{display:"flex",flexDirection:"column",style:{minHeight:l?396:432}},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"6",height:"full",justifyContent:"center",marginX:"8"},F)))))}var Cd="_1am14412",yd="_1am14410",Ad="_1am14413",Ed=({wallet:e})=>a.createElement("svg",{className:Ad,viewBox:"0 0 86 86",width:"86",height:"86"},a.createElement("title",null,"Loading"),a.createElement("rect",{x:"3",y:"3",width:80,height:80,rx:20,ry:20,strokeDasharray:`${160/3} ${320/3}`,strokeDashoffset:160,className:Cd,style:{stroke:e?.iconAccent||"#0D3887"}}));function Ga({onClose:e,wallet:t,connecting:n}){const{connect:o,iconBackground:r,iconUrl:i,id:s,name:c,getMobileUri:m,ready:g,shortName:d,showWalletConnectModal:h}=t,l=Oa(i),f=b.useRef(!1),{i18n:u}=b.useContext(H),p=b.useCallback(async()=>{if(s!=="walletConnect"&&(async()=>{const y=await m?.();if(y)if(y&&fu({mobileUri:y,name:c}),y.startsWith("http")){const A=document.createElement("a");A.href=y,A.target="_blank",A.rel="noreferrer noopener",A.click()}else window.location.href=y})(),h){h(),e?.();return}try{await o?.()}catch{}},[o,m,h,e,c,s]);return b.useEffect(()=>{n&&!f.current&&(p(),f.current=!0)},[n,p]),a.createElement(w,{as:"button",color:g?"modalText":"modalTextSecondary",disabled:!g,fontFamily:"body",key:s,onClick:p,ref:l,style:{overflow:"visible",textAlign:"center"},testId:`wallet-option-${s}`,type:"button",width:"full"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",justifyContent:"center"},a.createElement(w,{display:"flex",alignItems:"center",justifyContent:"center",paddingBottom:"8",paddingTop:"10",position:"relative"},n?a.createElement(Ed,{wallet:t}):null,a.createElement(Y,{background:r,borderRadius:"13",boxShadow:"walletLogo",height:"60",src:i,width:"60"})),n?null:a.createElement(w,{display:"flex",flexDirection:"column",textAlign:"center"},a.createElement(B,{as:"h2",color:t.ready?"modalText":"modalTextSecondary",size:"13",weight:"medium"},a.createElement(w,{as:"span",position:"relative"},d??c,!t.ready&&" (unsupported)")),t.recent&&a.createElement(B,{color:"accentColor",size:"12",weight:"medium"},u.t("connect.recent")))))}function Ja({onClose:e}){const t="rk_connect_title",n=qe().filter(f=>f.isRainbowKitConnector),{disclaimer:o,learnMoreUrl:r}=b.useContext(lt);let i=null,s=null,c=!1,m=null;const[g,d]=b.useState("CONNECT"),{i18n:h}=b.useContext(H),l=st();switch(g){case"CONNECT":{i=h.t("connect.title"),c=!0,s=a.createElement(w,null,a.createElement(w,{background:"profileForeground",className:yd,display:"flex",paddingBottom:"20",paddingTop:"6"},a.createElement(w,{display:"flex",style:{margin:"0 auto"}},n.filter(f=>f.ready).map(f=>a.createElement(w,{key:f.id,paddingX:"20"},a.createElement(w,{width:"60"},a.createElement(Ga,{onClose:e,wallet:f})))))),a.createElement(w,{background:"generalBorder",height:"1",marginBottom:"32",marginTop:"-1"}),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"32",paddingX:"32",style:{textAlign:"center"}},a.createElement(w,{display:"flex",flexDirection:"column",gap:"8",textAlign:"center"},a.createElement(B,{color:"modalText",size:"16",weight:"bold"},h.t("intro.title")),a.createElement(B,{color:"modalTextSecondary",size:"16"},h.t("intro.description")))),a.createElement(w,{paddingTop:"32",paddingX:"20"},a.createElement(w,{display:"flex",gap:"14",justifyContent:"center"},a.createElement(oe,{label:h.t("intro.get.label"),onClick:()=>d("GET"),size:"large",type:"secondary"}),a.createElement(oe,{href:r,label:h.t("intro.learn_more.label"),size:"large",type:"secondary"}))),o&&a.createElement(w,{marginTop:"28",marginX:"32",textAlign:"center"},a.createElement(o,{Link:qn,Text:Vn})));break}case"GET":{i=h.t("get.title"),m="CONNECT";const f=n?.filter(u=>u.downloadUrls?.ios||u.downloadUrls?.android||u.downloadUrls?.mobile)?.splice(0,3);s=a.createElement(w,null,a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",marginBottom:"36",marginTop:"5",paddingTop:"12",width:"full"},f.map((u,p)=>{const{downloadUrls:v,iconBackground:y,iconUrl:A,name:E}=u;return!v?.ios&&!v?.android&&!v?.mobile?null:a.createElement(w,{display:"flex",gap:"16",key:u.id,paddingX:"20",width:"full"},a.createElement(w,{style:{minHeight:48,minWidth:48}},a.createElement(Y,{background:y,borderColor:"generalBorder",borderRadius:"10",height:"48",src:A,width:"48"})),a.createElement(w,{display:"flex",flexDirection:"column",width:"full"},a.createElement(w,{alignItems:"center",display:"flex",height:"48"},a.createElement(w,{width:"full"},a.createElement(B,{color:"modalText",size:"18",weight:"bold"},E)),a.createElement(oe,{href:(l?v?.ios:v?.android)||v?.mobile,label:h.t("get.action.label"),size:"small",type:"secondary"})),p<f.length-1&&a.createElement(w,{background:"generalBorderDim",height:"1",marginY:"10",width:"full"})))})),a.createElement(w,{style:{marginBottom:"42px"}}),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",gap:"36",paddingX:"36",style:{textAlign:"center"}},a.createElement(w,{display:"flex",flexDirection:"column",gap:"12",textAlign:"center"},a.createElement(B,{color:"modalText",size:"16",weight:"bold"},h.t("get.looking_for.title")),a.createElement(B,{color:"modalTextSecondary",size:"16"},h.t("get.looking_for.mobile.description")))));break}}return a.createElement(w,{display:"flex",flexDirection:"column",paddingBottom:"36"},a.createElement(w,{background:c?"profileForeground":"modalBackground",display:"flex",flexDirection:"column",paddingBottom:"4",paddingTop:"14"},a.createElement(w,{display:"flex",justifyContent:"center",paddingBottom:"6",paddingX:"20",position:"relative"},m&&a.createElement(w,{display:"flex",position:"absolute",style:{left:0,marginBottom:-20,marginTop:-20}},a.createElement(w,{alignItems:"center",as:"button",className:V({active:"shrinkSm",hover:"growLg"}),color:"accentColor",display:"flex",marginLeft:"4",marginTop:"20",onClick:()=>d(m),padding:"16",style:{height:17,willChange:"transform"},transition:"default",type:"button"},a.createElement(Ra,null))),a.createElement(w,{marginTop:"4",textAlign:"center",width:"full"},a.createElement(B,{as:"h1",color:"modalText",id:t,size:"20",weight:"bold"},i)),a.createElement(w,{alignItems:"center",display:"flex",height:"32",paddingRight:"14",position:"absolute",right:"0"},a.createElement(w,{style:{marginBottom:-20,marginTop:-20}},a.createElement(Se,{onClose:e}))))),a.createElement(w,{display:"flex",flexDirection:"column"},s))}var xd=({onClose:e})=>{const{connector:t}=b.useContext(Ve),{i18n:n}=b.useContext(H),o=t?.name||"";return a.createElement(w,null,a.createElement(w,{display:"flex",paddingBottom:"32",justifyContent:"center",alignItems:"center",background:"profileForeground",flexDirection:"column"},a.createElement(w,{width:"full",display:"flex",justifyContent:"flex-end",marginTop:"18",marginRight:"24"},a.createElement(Se,{onClose:e})),a.createElement(w,{width:"60"},a.createElement(Ga,{onClose:e,wallet:t,connecting:!0})),a.createElement(w,{marginTop:"20"},a.createElement(B,{textAlign:"center",color:"modalText",size:"18",weight:"semibold"},n.t("connect.status.connect_mobile",{wallet:o}))),a.createElement(w,{maxWidth:"full",marginTop:"8"},a.createElement(B,{textAlign:"center",color:"modalText",size:"16",weight:"medium"},n.t("connect.status.confirm_mobile",{wallet:o})))))};function kd({onClose:e}){const{connector:t}=b.useContext(Ve);return z()?t?a.createElement(xd,{onClose:e}):a.createElement(Ja,{onClose:e}):a.createElement(Ka,{onClose:e})}function jd({onClose:e,open:t}){const n="rk_connect_title",o=Wt(),{disconnect:r}=En(),{isConnecting:i}=$(),s=a.useCallback(()=>{e(),r()},[e,r]),c=a.useCallback(()=>{i&&r(),e()},[e,r,i]);return o==="disconnected"?a.createElement(Dt,{onClose:c,open:t,titleId:n},a.createElement(Mt,{bottomSheetOnMobile:!0,padding:"0",wide:!0},a.createElement(kd,{onClose:c}))):o==="unauthenticated"?a.createElement(Dt,{onClose:s,open:t,titleId:n},a.createElement(Mt,{bottomSheetOnMobile:!0,padding:"0"},a.createElement(uu,{onClose:s,onCloseModal:e}))):null}function dn(){const[e,t]=b.useState(!1);return{closeModal:b.useCallback(()=>t(!1),[]),isModalOpen:e,openModal:b.useCallback(()=>t(!0),[])}}var ze=b.createContext({accountModalOpen:!1,chainModalOpen:!1,connectModalOpen:!1,isWalletConnectModalOpen:!1,setIsWalletConnectModalOpen:()=>{}});function _d({children:e}){const{closeModal:t,isModalOpen:n,openModal:o}=dn(),{closeModal:r,isModalOpen:i,openModal:s}=dn(),{closeModal:c,isModalOpen:m,openModal:g}=dn(),[d,h]=b.useState(!1),l=Wt(),{chainId:f}=$(),{chains:u}=Rt(),p=u.some(A=>A.id===f),v=b.useCallback(({keepConnectModalOpen:A=!1}={})=>{A||t(),r(),c()},[t,r,c]),y=Nt()==="unauthenticated";return Ot({onConnect:()=>v({keepConnectModalOpen:y}),onDisconnect:()=>v()}),b.useEffect(()=>{y&&v()},[y,v]),a.createElement(ze.Provider,{value:b.useMemo(()=>({accountModalOpen:i,chainModalOpen:m,connectModalOpen:n,isWalletConnectModalOpen:d,openAccountModal:p&&l==="connected"?s:void 0,openChainModal:l==="connected"?g:void 0,openConnectModal:l==="disconnected"||l==="unauthenticated"?o:void 0,setIsWalletConnectModalOpen:h}),[l,i,m,n,s,g,o,p,d])},e,a.createElement(jd,{onClose:t,open:n}),a.createElement(Fu,{onClose:r,open:i}),a.createElement(Vu,{onClose:c,open:m}))}function Ya(){const{accountModalOpen:e,chainModalOpen:t,connectModalOpen:n}=b.useContext(ze);return{accountModalOpen:e,chainModalOpen:t,connectModalOpen:n}}function Xa(){const{accountModalOpen:e,openAccountModal:t}=b.useContext(ze);return{accountModalOpen:e,openAccountModal:t}}function Za(){const{chainModalOpen:e,openChainModal:t}=b.useContext(ze);return{chainModalOpen:e,openChainModal:t}}function $a(){const{isWalletConnectModalOpen:e,setIsWalletConnectModalOpen:t}=b.useContext(ze);return{isWalletConnectModalOpen:e,setIsWalletConnectModalOpen:t}}function Kn(){const{connectModalOpen:e,openConnectModal:t}=b.useContext(ze),{isWalletConnectModalOpen:n}=$a();return{connectModalOpen:e||n,openConnectModal:t}}var fn=()=>{};function Gn({children:e}){const t=la(),{address:n}=$(),{chainId:o}=$(),{chains:r}=Rt(),i=r.some(G=>G.id===o),s=gc(),c=Nt()??void 0,m=o?s[o]:void 0,g=m?.name??void 0,d=m?.iconUrl??void 0,h=m?.iconBackground??void 0,l=Pt(d),f=b.useContext(Fn),u=pa().some(({status:G})=>G==="pending")&&f,{showBalance:p}=sa(),y=typeof p=="boolean"?p:p?Zr(p)[z()?"smallScreen":"largeScreen"]:!0,{balance:A,ensAvatar:E,ensName:C}=ua({address:n,includeBalance:y}),x=A?`${Ia(Number.parseFloat(A.formatted))} ${A.symbol}`:void 0,{openConnectModal:j}=Kn(),{openChainModal:I}=Za(),{openAccountModal:D}=Xa(),{accountModalOpen:L,chainModalOpen:P,connectModalOpen:Z}=Ya();return a.createElement(a.Fragment,null,e({account:n?{address:n,balanceDecimals:A?.decimals,balanceFormatted:A?.formatted,balanceSymbol:A?.symbol,displayBalance:x,displayName:C?Ta(C):Sa(n),ensAvatar:E??void 0,ensName:C??void 0,hasPendingTransactions:u}:void 0,accountModalOpen:L,authenticationStatus:c,chain:o?{hasIcon:!!d,iconBackground:h,iconUrl:l,id:o,name:g,unsupported:!i}:void 0,chainModalOpen:P,connectModalOpen:Z,mounted:t(),openAccountModal:D??fn,openChainModal:I??fn,openConnectModal:j??fn}))}Gn.displayName="ConnectButton.Custom";var tt={accountStatus:"full",chainStatus:{largeScreen:"full",smallScreen:"icon"},label:"Connect Wallet",showBalance:{largeScreen:!0,smallScreen:!1}};function Jn({accountStatus:e=tt.accountStatus,chainStatus:t=tt.chainStatus,label:n=tt.label,showBalance:o=tt.showBalance}){const r=Te(),i=Wt(),{setShowBalance:s}=sa(),[c,m]=b.useState(!1),{i18n:g}=b.useContext(H);return b.useEffect(()=>{s(o),c||m(!0)},[o,s]),c?a.createElement(Gn,null,({account:d,chain:h,mounted:l,openAccountModal:f,openChainModal:u,openConnectModal:p})=>{const v=l&&i!=="loading",y=h?.unsupported??!1;return a.createElement(w,{display:"flex",gap:"12",...!v&&{"aria-hidden":!0,style:{opacity:0,pointerEvents:"none",userSelect:"none"}}},v&&d&&i==="connected"?a.createElement(a.Fragment,null,h&&(r.length>1||y)&&a.createElement(w,{alignItems:"center","aria-label":"Chain Selector",as:"button",background:y?"connectButtonBackgroundError":"connectButtonBackground",borderRadius:"connectButton",boxShadow:"connectButton",className:V({active:"shrink",hover:"grow"}),color:y?"connectButtonTextError":"connectButtonText",display:Oe(t,A=>A==="none"?"none":"flex"),fontFamily:"body",fontWeight:"bold",gap:"6",key:y?"unsupported":"supported",onClick:u,paddingX:"10",paddingY:"8",testId:y?"wrong-network-button":"chain-button",transition:"default",type:"button"},y?a.createElement(w,{alignItems:"center",display:"flex",height:"24",paddingX:"4"},g.t("connect_wallet.wrong_network.label")):a.createElement(w,{alignItems:"center",display:"flex",gap:"6"},h.hasIcon?a.createElement(w,{display:Oe(t,A=>A==="full"||A==="icon"?"block":"none"),height:"24",width:"24"},a.createElement(Y,{alt:h.name??"Chain icon",background:h.iconBackground,borderRadius:"full",height:"24",src:h.iconUrl,width:"24"})):null,a.createElement(w,{display:Oe(t,A=>A==="icon"&&!h.iconUrl||A==="full"||A==="name"?"block":"none")},h.name??h.id)),a.createElement(Lo,null)),!y&&a.createElement(w,{alignItems:"center",as:"button",background:"connectButtonBackground",borderRadius:"connectButton",boxShadow:"connectButton",className:V({active:"shrink",hover:"grow"}),color:"connectButtonText",display:"flex",fontFamily:"body",fontWeight:"bold",onClick:f,testId:"account-button",transition:"default",type:"button"},d.displayBalance&&a.createElement(w,{display:Oe(o,A=>A?"block":"none"),padding:"8",paddingLeft:"12"},d.displayBalance),a.createElement(w,{background:Zr(o)[z()?"smallScreen":"largeScreen"]?"connectButtonInnerBackground":"connectButtonBackground",borderColor:"connectButtonBackground",borderRadius:"connectButton",borderStyle:"solid",borderWidth:"2",color:"connectButtonText",fontFamily:"body",fontWeight:"bold",paddingX:"8",paddingY:"6",transition:"default"},a.createElement(w,{alignItems:"center",display:"flex",gap:"6",height:"24"},a.createElement(w,{display:Oe(e,A=>A==="full"||A==="avatar"?"block":"none")},a.createElement(ra,{address:d.address,imageUrl:d.ensAvatar,loading:d.hasPendingTransactions,size:24})),a.createElement(w,{alignItems:"center",display:"flex",gap:"6"},a.createElement(w,{display:Oe(e,A=>A==="full"||A==="address"?"block":"none")},d.displayName),a.createElement(Lo,null)))))):a.createElement(w,{as:"button",background:"accentColor",borderRadius:"connectButton",boxShadow:"connectButton",className:V({active:"shrink",hover:"grow"}),color:"accentColorForeground",fontFamily:"body",fontWeight:"bold",height:"40",key:"connect",onClick:p,paddingX:"14",testId:"connect-button",transition:"default",type:"button"},l&&n==="Connect Wallet"?g.t("connect_wallet.label"):n))}):a.createElement(a.Fragment,null)}Jn.__defaultProps=tt;Jn.Custom=Gn;var Bd="_1y2lnfi0",Id="_1y2lnfi1";function ei({wallet:e="rainbow",children:t}){const n=la(),{openConnectModal:o}=Kn(),{connectModalOpen:r}=Ya(),{connector:i,setConnector:s}=b.useContext(Ve),[c]=qe().filter(x=>x.isRainbowKitConnector).filter(x=>x.id.toLowerCase()===e.toLowerCase()).sort((x,j)=>x.groupIndex-j.groupIndex);if(!c)throw new Error("Connector not found");const m=Wt(),[g,d]=b.useState(!1),[h,l]=b.useState(!1),f=z();b.useEffect(()=>{!r&&i&&s(null)},[r,i,s]);const{isConnected:u,isConnecting:p}=$();Ot({onConnect:()=>{h&&l(!1)},onDisconnect:Zu});const v=b.useMemo(()=>{const x=Xu();return!x||!c?.id||!u?!1:x===c?.id},[u,c]),y=async()=>{try{d(!0),h&&l(!1),await c?.connect?.()}catch{l(!0)}finally{d(!1)}},E=!p&&!!o&&c&&!(m==="loading"),C=!c?.installed||!c?.ready;return a.createElement(a.Fragment,null,t({error:h,loading:g,connected:v,ready:E,mounted:n(),connector:c,connect:async()=>{if(Fa(c?.id||""),f||C){o?.(),s(c);return}await y()}}))}var ti=({wallet:e})=>a.createElement(ei,{wallet:e},({ready:t,connect:n,connected:o,mounted:r,connector:i,loading:s})=>{const c=!t||s,{i18n:m}=b.useContext(H),g=i?.name||"";if(r)return a.createElement(w,{display:"flex",flexDirection:"column",alignItems:"center",disabled:c,pointerEvents:c?"none":"all"},a.createElement(w,{as:"button",borderRadius:"menuButton",borderStyle:"solid",borderWidth:"1",className:[Id,Bd,V({active:"shrink",hover:"grow"})],minHeight:"44",onClick:n,disabled:!t||s,padding:"6",style:{willChange:"transform"},testId:`wallet-button-${i?.id||""}`,transition:"default",width:"full",background:"connectButtonBackground"},a.createElement(w,{color:"modalText",fontFamily:"body",fontSize:"16",fontWeight:"bold",transition:"default",display:"flex",alignItems:"center"},a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"row",gap:"12",paddingRight:"6"},a.createElement(w,null,s?a.createElement(Qe,null):a.createElement(Y,{background:i?.iconBackground,borderRadius:"6",height:"28",src:i?.iconUrl,width:"28"})),a.createElement(w,{alignItems:"center",display:"flex",flexDirection:"column",color:"modalText"},a.createElement(w,{testId:`wallet-button-label-${i?.id||""}`},s?m.t("connect.status.connecting",{wallet:g}):g)),o?a.createElement(w,{background:"connectionIndicator",borderColor:"selectedOptionBorder",borderRadius:"full",borderStyle:"solid",borderWidth:"1",height:"8",width:"8"}):null))))});ti.Custom=ei;var ni=({appName:e,appDescription:t,appUrl:n,appIcon:o})=>({name:e,description:t??e,url:n??(typeof window<"u"?window.location.origin:""),icons:[...o?[o]:[]]});function Sd(e){return Object.fromEntries(Object.entries(e).filter(([t,n])=>n!==void 0))}function Td(e,t){const n=[];for(const o of e)n.some(r=>r[t]===o[t])||n.push(o);return n}var Yn=(e,{projectId:t,walletConnectParameters:n,appName:o,appDescription:r,appUrl:i,appIcon:s})=>{if(!e.length)throw new Error("No wallet list was provided");for(const{wallets:f,groupName:u}of e)if(!f.length)throw new Error(`No wallets provided for group: ${u}`);let c=-1;const m=[],g=[],d=[],h=ni({appName:o,appDescription:r,appUrl:i,appIcon:s});for(const[f,{groupName:u,wallets:p}]of e.entries())for(const v of p){c++;const y=v({projectId:t,appName:o,appIcon:s,options:{metadata:h,...n},walletConnectParameters:{metadata:h,...n}});if(y?.iconAccent&&!ed(y?.iconAccent))throw new Error(`Property \`iconAccent\` is not a hex value for wallet: ${y.name}`);const A={...y,groupIndex:f+1,groupName:u,index:c};typeof y.hidden=="function"?d.push(A):g.push(A)}const l=Td([...g,...d],"id");for(const{createConnector:f,groupIndex:u,groupName:p,hidden:v,...y}of l){if(typeof v=="function"&&v())continue;const A=x=>({rkDetails:Sd({...y,groupIndex:u,groupName:p,isRainbowKitConnector:!0,...x||{}})});y.id==="walletConnect"&&m.push(f(A({isWalletConnectModalConnector:!0,showQrModal:!0})));const C=f(A());m.push(C)}return m},ur=new Map,Dd=({projectId:e,walletConnectParameters:t,rkDetailsShowQrModal:n,rkDetailsIsWalletConnectModalConnector:o})=>{let r={...t||{},projectId:e,showQrModal:!1};n&&(r={...r,showQrModal:!0}),"customStoragePrefix"in r||(r={...r,customStoragePrefix:o?"clientOne":"clientTwo"});const i=JSON.stringify(r),s=ur.get(i);if(s)return s;const c=Mn(r);return ur.set(i,c),c};function Md({projectId:e,walletDetails:t,walletConnectParameters:n}){return ye(o=>({...Dd({projectId:e,walletConnectParameters:n,rkDetailsShowQrModal:t.rkDetails.showQrModal,rkDetailsIsWalletConnectModalConnector:t.rkDetails.isWalletConnectModalConnector})(o),...t}))}function qt({projectId:e,walletConnectParameters:t}){const n="21fef48091f12692cad574a6f7753643";if(!e||e==="")throw new Error("No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2 https://www.rainbowkit.com/docs/installation#configure");return e==="YOUR_PROJECT_ID"&&(e=n),o=>Md({projectId:e,walletDetails:o,walletConnectParameters:t})}function oi(e){const t=typeof window<"u"?window:void 0;if(typeof t>"u"||typeof t.ethereum>"u")return;const n=t.ethereum.providers;return n?n.find(o=>o[e]):t.ethereum[e]?t.ethereum:void 0}function ri(e){const t=(n,o)=>{const[r,...i]=o.split("."),s=n[r];if(s)return i.length===0?s:t(s,i.join("."))};if(typeof window<"u")return t(window,e)}function Rd({flag:e,namespace:t}){return!!(t&&typeof ri(t)<"u"||typeof oi(e)<"u")}function Od({flag:e,namespace:t}){const n=typeof window<"u"?window:void 0;if(typeof n>"u")return;if(t){const r=ri(t);if(r)return r}const o=n.ethereum?.providers;{const r=oi(e);if(r)return r}return typeof o<"u"&&o.length>0?o[0]:n.ethereum}function Ld(e){return t=>{const n=e?{target:()=>({id:t.rkDetails.id,name:t.rkDetails.name,provider:e})}:{};return ye(o=>({...xi(n)(o),...t}))}}function Fd({flag:e,namespace:t,target:n}){const o=n||Od({flag:e,namespace:t});return Ld(o)}var Xn=({appName:e,appIcon:t})=>({id:"baseAccount",name:"Base Account",shortName:"Base Account",rdns:"app.base.account",iconUrl:async()=>(await k(async()=>{const{default:n}=await import("./baseAccount-44UITRK7-CsjdbWCf.js");return{default:n}},[])).default,iconAccent:"#0000FF",iconBackground:"#0000FF",installed:!0,createConnector:n=>{const{...o}=Xn,r=Ml({appName:e,appLogoUrl:t,...o});return ye(i=>({...r(i),...n}))}});function Nd(e){return!(!e?.isMetaMask||e.isBraveWallet&&!e._events&&!e._state||e.isApexWallet||e.isAvalanche||e.isBackpack||e.isBifrost||e.isBitKeep||e.isBitski||e.isBlockWallet||e.isCoinbaseWallet||e.isDawn||e.isEnkrypt||e.isExodus||e.isFrame||e.isFrontier||e.isGamestop||e.isHyperPay||e.isImToken||e.isKuCoinWallet||e.isMathWallet||e.isNestWallet||e.isOkxWallet||e.isOKExWallet||e.isOneInchIOSWallet||e.isOneInchAndroidWallet||e.isOpera||e.isPhantom||e.isPortal||e.isRabby||e.isRainbow||e.isStatus||e.isTalisman||e.isTally||e.isTokenPocket||e.isTokenary||e.isTrust||e.isTrustWallet||e.isXDEFI||e.isZeal||e.isZerion||e.__seif)}var ai=({projectId:e,walletConnectParameters:t})=>{const n=typeof window<"u"?Nd(window.ethereum):!1,o=!n&&!z(),r=n||z();return{id:"metaMask",name:"MetaMask",rdns:"io.metamask",iconUrl:async()=>(await k(async()=>{const{default:i}=await import("./metaMaskWallet-SITXT2FV-BlemcphV.js");return{default:i}},[])).default,iconAccent:"#f6851a",iconBackground:"#fff",installed:n||void 0,downloadUrls:{android:"https://play.google.com/store/apps/details?id=io.metamask",ios:"https://apps.apple.com/us/app/metamask/id1438144202",mobile:"https://metamask.io/download",qrCode:"https://metamask.io/download",chrome:"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",edge:"https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm",firefox:"https://addons.mozilla.org/firefox/addon/ether-metamask",opera:"https://addons.opera.com/extensions/details/metamask-10",browserExtension:"https://metamask.io/download"},mobile:{getUri:r?i=>i:void 0},qrCode:o?{getUri:i=>`https://metamask.app.link/wc?uri=${encodeURIComponent(i)}`,instructions:{learnMoreUrl:"https://metamask.io/faqs/",steps:[{description:"wallet_connectors.metamask.qr_code.step1.description",step:"install",title:"wallet_connectors.metamask.qr_code.step1.title"},{description:"wallet_connectors.metamask.qr_code.step2.description",step:"create",title:"wallet_connectors.metamask.qr_code.step2.title"},{description:"wallet_connectors.metamask.qr_code.step3.description",step:"refresh",title:"wallet_connectors.metamask.qr_code.step3.title"}]}}:void 0,extension:{instructions:{learnMoreUrl:"https://metamask.io/faqs/",steps:[{description:"wallet_connectors.metamask.extension.step1.description",step:"install",title:"wallet_connectors.metamask.extension.step1.title"},{description:"wallet_connectors.metamask.extension.step2.description",step:"create",title:"wallet_connectors.metamask.extension.step2.title"},{description:"wallet_connectors.metamask.extension.step3.description",step:"refresh",title:"wallet_connectors.metamask.extension.step3.title"}]}},createConnector:o?qt({projectId:e,walletConnectParameters:t}):(i=>ye(s=>{const c=Tn({dappMetadata:{connector:"rainbowkit",name:t?.metadata?.name,iconUrl:t?.metadata?.icons[0],url:t?.metadata?.url},headless:!0,checkInstallationImmediately:!1,enableAnalytics:!1})(s);return{...c,...i,getChainId:async()=>{try{return await c.getChainId()}catch{return s.chains[0]?.id??1}}}}))}},ii=({projectId:e,walletConnectParameters:t})=>{const n=Rd({flag:"isRainbow"}),o=!n,r=i=>$r()?i:st()?`rainbow://wc?uri=${encodeURIComponent(i)}&connector=rainbowkit`:`https://rnbwapp.com/wc?uri=${encodeURIComponent(i)}&connector=rainbowkit`;return{id:"rainbow",name:"Rainbow",rdns:"me.rainbow",iconUrl:async()=>(await k(async()=>{const{default:i}=await import("./rainbowWallet-O26YNBMX-DUhYus-9.js");return{default:i}},[])).default,iconBackground:"#0c2f78",installed:o?void 0:n,downloadUrls:{android:"https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Drainbowkit&utm_source=rainbowkit",ios:"https://apps.apple.com/app/apple-store/id1457119021?pt=119997837&ct=rainbowkit&mt=8",mobile:"https://rainbow.download?utm_source=rainbowkit",qrCode:"https://rainbow.download?utm_source=rainbowkit&utm_medium=qrcode",browserExtension:"https://rainbow.me/extension?utm_source=rainbowkit"},mobile:{getUri:o?r:void 0},qrCode:o?{getUri:r,instructions:{learnMoreUrl:"https://learn.rainbow.me/connect-to-a-website-or-app?utm_source=rainbowkit&utm_medium=connector&utm_campaign=learnmore",steps:[{description:"wallet_connectors.rainbow.qr_code.step1.description",step:"install",title:"wallet_connectors.rainbow.qr_code.step1.title"},{description:"wallet_connectors.rainbow.qr_code.step2.description",step:"create",title:"wallet_connectors.rainbow.qr_code.step2.title"},{description:"wallet_connectors.rainbow.qr_code.step3.description",step:"scan",title:"wallet_connectors.rainbow.qr_code.step3.title"}]}}:void 0,createConnector:o?qt({projectId:e,walletConnectParameters:t}):Fd({flag:"isRainbow"})}},si=()=>({id:"safe",name:"Safe",iconAccent:"#12ff80",iconBackground:"#fff",iconUrl:async()=>(await k(async()=>{const{default:e}=await import("./safeWallet-5MNKTR5Z-D-5imDLD.js");return{default:e}},[])).default,installed:!(typeof window>"u")&&window?.parent!==window,downloadUrls:{},createConnector:e=>ye(t=>({...Dn()(t),...e}))}),li=({projectId:e,options:t})=>({id:"walletConnect",name:"WalletConnect",installed:void 0,iconUrl:async()=>(await k(async()=>{const{default:o}=await import("./walletConnectWallet-YHWKVTDY-D3lyiczV.js");return{default:o}},[])).default,iconBackground:"#3b99fc",qrCode:{getUri:o=>o},createConnector:qt({projectId:e,walletConnectParameters:t})}),Wd=e=>e.reduce((n,o)=>{const r=o.id;return n[r]=yi(),n},{}),Pd=({appName:e,appDescription:t,appUrl:n,appIcon:o,wallets:r,projectId:i,...s})=>{const{transports:c,chains:m,...g}=s,d=ni({appName:e,appDescription:t,appUrl:n,appIcon:o}),h=Yn(r||[{groupName:"Popular",wallets:[si,ii,Xn,ai,li]}],{projectId:i,appName:e,appDescription:t,appUrl:n,appIcon:o,walletConnectParameters:{metadata:d}});return vi({connectors:h,chains:m,transports:c||Wd(m),...g})};function Ud(e){const t=[{groupName:"Popular",wallets:[si,ii,Xn,ai,li]}];return e?{connectors:Yn(t,e),wallets:t}:{wallets:t}}function Qd(){const e=Ln(),{address:t}=$(),n=Ut();return b.useCallback(o=>{if(!t||!n)throw new Error("No address or chain ID found");e.addTransaction(t,n,o)},[e,t,n])}var qd={DesktopOptions:Ka,dialogContent:_a,dialogContentMobile:Ba,MobileOptions:Ja};const Kd=Object.freeze(Object.defineProperty({__proto__:null,ConnectButton:Jn,RainbowKitAuthenticationProvider:Wl,RainbowKitProvider:wu,WalletButton:ti,__private__:qd,connectorsForWallets:Yn,createAuthenticationAdapter:Nl,cssObjectFromTheme:ha,cssStringFromTheme:yn,darkTheme:wr,getDefaultConfig:Pd,getDefaultWallets:Ud,getWalletConnectConnector:qt,lightTheme:kn,midnightTheme:br,useAccountModal:Xa,useAddRecentTransaction:Qd,useChainModal:Za,useConnectModal:Kn},Symbol.toStringTag,{value:"Module"})),dr=Object.freeze(Object.defineProperty({__proto__:null,default:pn},Symbol.toStringTag,{value:"Module"}));export{Jn as C,ji as d,Kd as i,In as m};
