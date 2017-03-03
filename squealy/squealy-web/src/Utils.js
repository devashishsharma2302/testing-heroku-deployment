import {
  RESPONSE_FORMATS,
  GOOGLE_CHART_TYPE_OPTIONS
} from './Constant'
import FileSaver from 'filesaver.js-npm'
/*!*************************************************************************
[Utils.js]
*****************************************************************************/
/* global define */
/**
 * Defines all the types necessary for making api calls.
 * module src/Utils
 */

/**
 * @module Utils
 * @params {String} Url - Provides the post url
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 */
export function postApiRequest(uri, data, onSuccessCallback,
                               onFailureCallback, callbackParmas) {
  data = jsonStringfy(data)
  apiCall(uri, data, 'POST', onSuccessCallback, onFailureCallback, callbackParmas)
}

export function baseUrl() {
  //FIXME: Revert these changes before deploying.
  //return window.location.origin + '/'
  return 'http://localhost:8000/'
}
/**
 * @module Utils
 * @params {String} Url - Provides the post url
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 */
export function getApiRequest(uri, data, onSuccessCallback, onFailureCallback,
                              interval) {
  apiCall(uri, data, 'GET', onSuccessCallback, onFailureCallback, interval)
}

/**
 * description: converts a JavaScript value to a JSON string
 * @module Utils
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 */
function jsonStringfy(data) {
  return JSON.stringify(data)
}

/**
 * description: Ajax call for post/get api
 * Created a method to be called to get the data and
 * stop the interval once the promise is resolved and user receives the data
 * @module Utils
 * @params {String} Url - Provides the post url
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 * @params {String} methodType - Defines type of request to be made
 * @params {Function} onSuccess - Success callback function
 * @params {Function} onFailure - Failure callback function
 * TODO: Need to add a callback function on success and failure
 */
export function apiCall(uri, data, methodType, onSuccess, onFailure, callbackParmas=null) {
  const csrftoken = getCookie('csrftoken');
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });
  $.ajax({
    url: uri,
    method: methodType,
    contentType: 'application/json',
    data: data,
    success: function (response) {
      if (onSuccess) {
        if(callbackParmas){
          onSuccess(response, callbackParmas)
        }else {
          onSuccess(response)
        }

      }
    },

    error: function (error) {
      if (onFailure) {
        onFailure(error)
      }
    }
  })
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


export function getEmptyApiDefinition() {
  return {
    id: null,
    name: 'first chart',
    url: 'first-chart',
    query: '',
    parameters: [],
    testParameters: {},
    validations: [],
    transformations: [],
    type: 'ColumnChart',
    options: {},
    chartData: {},
    pivotColumn: undefined,
    metric: undefined,
    columnsToMerge: undefined,
    newColumnName: '',
    apiErrorMsg: null
  }
}


export function getEmptyWidgetDefinition() {
  return {
    width: 4,
    height: 20,
    top: 7,
    left: 1,
    title: 'Chart Title',
    chartType: GOOGLE_CHART_TYPE_OPTIONS[7].value,
    chartStyles: {},
    api_url: '',
    apiParams: {}
  }
}


export function getEmptyParamDefinition(apiIndex) {
  return {
    name: '',
    data_type: 'string',
    mandatory: false,
    default_value: '',
    kwargs: {},
    test_value: ''
  }
}


function processParamDef(definitions) {
  let appliedDef = {}
  if (definitions.length) {
    definitions.map((data) => {
      appliedDef[data.name] = {
        type: data.type,
        optional: data.optional,
        default_value: data.default_value,
        isParamDefCustom: data.isParamDefCustom
      }
      if (data.hasOwnProperty('kwargs')) {
        appliedDef[data.name].kwargs = data.kwargs
      }
    })
  }
  return appliedDef
}


// The following function loads the google charts JS files
export function googleChartLoader(onSuccess, version, packages) {
  var options = {
    dataType: 'script',
    cache: true,
    url: 'https://www.gstatic.com/charts/loader.js',
  };
  jQuery.ajax(options).done(function(){
    google.charts.load(version || 'current', {
      packages: packages || ['corechart'],
      'callback': onSuccess
    });
  });
}


function execRegexGroupedMulValues(regex, text, result) {
  let match = regex.exec(text),
    newResult = result.slice()

  while (match !== null) {
    if (newResult.indexOf(match[1]) === -1) {
      newResult.push(match[1])
    }
    match = regex.exec(text)
  }

  return newResult
}



export function fetchQueryParamsFromQuery(text) {
  let regExpForParams = /{{\s*params\.([^\s}%]+)\s*}}/g,
      regExpForExp = /{%[^(%})]*params\.([^\s}%]+)[^({%)]*%}/g,
      paramsArray = []


  paramsArray = execRegexGroupedMulValues(regExpForParams, text, paramsArray)
  paramsArray = execRegexGroupedMulValues(regExpForExp, text, paramsArray)

  return paramsArray
}

// export function fetchSessionParamsFromQuery(text) {
//   let regExpForParams = /{{\s*user\.([^\s}%]+)\s*}}/g,
//       regExpForExp = /{%[^(%})]*user\.([^\s}%]+)[^({%)]*%}/g,
//       paramsArray = []


//   paramsArray = execRegexGroupedMulValues(regExpForParams, text, paramsArray)
//   paramsArray = execRegexGroupedMulValues(regExpForExp, text, paramsArray)

//   return paramsArray
// }

export function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


export function checkObjectAlreadyExists (data, keyName, value) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].hasOwnProperty(keyName) && data[i][keyName] === value) {
      return true
    }
  }
  return false
}

export function formatTestParameters (paramDefintion) {
  let testParams = {}

  paramDefintion.map((param) => {
    testParams[param['name']] = param['test_value']
  })
  return testParams
}
