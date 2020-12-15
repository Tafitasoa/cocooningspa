/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/buttons-prestation.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/buttons-prestation.js":
/*!****************************************************!*\
  !*** ./app/javascript/packs/buttons-prestation.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

document.getElementById('cart-btn-ok').addEventListener('click', showCart);
numberOrder();

function numberOrder() {
  var spa = JSON.parse(sessionStorage.getItem("spa"));
  var massages = JSON.parse(sessionStorage.getItem("massages"));
  var cadeau = JSON.parse(sessionStorage.getItem("cadeau"));
  var prestations = JSON.parse(sessionStorage.getItem("prestations"));
  var number = 0;
  var totalPrice = 0;
  var spaAndMassage = "<ul class=\"ul-btn\">";

  if (spa) {
    for (var i = spa.length - 1; i >= 0; i--) {
      if (spa[i].time != "") {
        number++;
      }
    }
  }

  if (number > 0) {
    spaAndMassage += "<li>Location spa: " + number + " <br> Prix : " + prestations.priceSpa + "€</li>";
    totalPrice += Number(prestations.priceSpa);
  }

  var numberMassage = 0;

  if (massages) {
    for (var i = massages.length - 1; i >= 0; i--) {
      if (typeof massages[i].sub != "string") {
        numberMassage++;
        number++;
      }
    }
  }

  if (numberMassage > 0) {
    spaAndMassage += "<li>Massage : " + numberMassage + " personnes <br>Prix : " + prestations.priceMassage + "€</li>";
    totalPrice += Number(prestations.priceMassage);
  }

  document.getElementById("cart-inner-prestation").innerHTML = spaAndMassage + "</ul>";
  var code_promo = 0;

  if (prestations.code_promo) {
    code_promo = prestations.code_promo[1];
    document.getElementById("promo-code").innerHTML = "Réduction de " + code_promo + "€";
  } else {
    document.getElementById("promo-code").innerHTML = "<ul class=\"ul-btn\">Vous n'avez pas inseré un code promo</ul>";
  }

  if (typeof totalPrice != "number") {
    document.getElementById("price-modal-cart").innerHTML = 0 + "€";
  } else {
    document.getElementById("price-modal-cart").innerHTML = totalPrice - code_promo + "€";
  }

  document.getElementById("number-cart-ok").innerHTML = number;
}

function showCart() {
  numberOrder();
  var cart = document.getElementById("cart-inner-ok");

  if (cart.classList[0] == "hidden") {
    cart.classList.remove("hidden");
  } else {// cart.classList.add("hidden")	
  }
}

/***/ })

/******/ });
//# sourceMappingURL=buttons-prestation-fba783b33a85b8ce44bd.js.map