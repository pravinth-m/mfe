//import { CommonDragLogic } from '@progress/kendo-react-grid/dist/npm/drag/CommonDragLogic';
import { transactionStatus } from './Enumeration';


//added by perumalraj on 07-08-2020
export function extractFieldHeader(fieldList) {
  let columnList = [];
  if (fieldList !== undefined && fieldList.length !== 0) {
    columnList = fieldList.filter(function (value, index, arr) {
      return (value["controlType"] !== "NA");
    });
  }
  return columnList;
}

export function getCurrentDateTime() {
  const tempDate = new Date();
  const date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
  return date;
}

export function sortData(masterData, sortType, columnName) {
  if (masterData) {
    if (Array.isArray(masterData)) {
      sortByField(masterData, sortType, columnName);
    }
    else {
      Object.keys(masterData).map((data) => {
        if (Array.isArray(masterData[data])) {
          sortByField(masterData[data], sortType, columnName)
        }
        return null;
      });
    }
  }
  return masterData;
}

export function sortByField(masterData, sortType, columnName) {
  if (masterData !== undefined && masterData.length > 0) {
    if (columnName === undefined || columnName === null) {
      if (masterData[0] !== undefined) {
        columnName = Object.keys(masterData[0])[0];
      }
    }
    if (sortType === "ascending") {
      masterData.sort((obj1, obj2) => obj1[columnName] !== null && obj2[columnName] !== null ?
        (typeof (obj1[columnName]) === 'string' ?
          obj1[columnName].toLowerCase() > obj2[columnName].toLowerCase() ? 1 : -1
          : obj1[columnName] > obj2[columnName] ? 1 : -1)
        : ""
      );

    }
    else {
      masterData.sort((obj1, obj2) => obj1[columnName] !== null && obj2[columnName] !== null ?
        (typeof (obj1[columnName]) === 'string' ?
          obj1[columnName].toLowerCase() < obj2[columnName].toLowerCase() ? 1 : -1
          : obj1[columnName] < obj2[columnName] ? 1 : -1)
        : ""
      );
    }
  }
  return masterData;
}

export function searchData(filterValue, originalData, fieldList) {
  let searchedData = [];

  if (originalData.length > 0) {
    let temp = originalData.filter(item => {
      const itemArray = [];
      fieldList.map(itemKey =>
        item[itemKey] && item[itemKey] !== null ?
          itemArray.push(typeof item[itemKey] === "string" ? item[itemKey].toLowerCase()
            : item[itemKey].toString().toLowerCase())
          : "")
      //   console.log(itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1)
      //  console.log(filterValue.toLowerCase())
      return itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1
    }
    )
    searchedData = temp;
  }
  return searchedData;
}
//end- search logic

//Given by Perumal
//To get Label Value Pair for a search select combo box
export function getComboLabelValue(selectedItem, optionList, findKey, labelKey) {

  let lblValueList = [];
  optionList.map((option) => {
    if (selectedItem && selectedItem[findKey] === option[findKey]) {
      lblValueList.push({ "value": option[findKey], "label": option[labelKey] })
    }
    return null;
  })
  return selectedItem[findKey] = lblValueList[0];
}

// To provide esign rights
export function showEsign(itemMap, nformcode, ncontrolcode) {
  const controlList = itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [];
  const index = controlList.findIndex(x => x.ncontrolcode === ncontrolcode);
  return controlList[index] && controlList[index].nneedesign === 3 ? true : false;
}

// To provide control rights
export function getControlMap(itemMap, nformcode) {
  const controlList = itemMap ? itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [] : [];
  const controlMap = new Map();
  controlList.map(item => {
    return controlMap.set(item.scontrolname, { ...item })
  })
  return controlMap;
}

export function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear(),
    hour = '' + d.getHours(),
    min = '' + d.getMinutes(),
    sec = '' + d.getSeconds();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  if (hour.length < 2) hour = '0' + hour;
  if (min.length < 2) min = '0' + min;
  if (sec.length < 2) sec = '0' + sec;


  return [year, month, day].join('-').concat(" " + hour + ":" + min + ":" + sec);
}

export function getStartOfDay(date) {
  date.setHours(0, 0, 0);
  return formatDate(date);
}

export function getEndOfDay(date) {
  date.setHours(23, 59, 59);
  return formatDate(date);
}

export function getDateByMinutes(date, holdMinutes) {
  const someDate = new Date(date);
  const adjustedDate = new Date(someDate);
  return adjustedDate.setMinutes(someDate.getMinutes() + holdMinutes);
}

export function validateTwoDigitDate(value) {
  if (value.length === 1) {
    value = "0".concat(value);
  }
  return value;
}

// To provide esign rights for child Tabs
export function showEsignForChildTabs(itemMap, ncontrolcode) {
  //  const controlList = itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [];
  const index = itemMap.findIndex(x => x.ncontrolcode === ncontrolcode);
  return itemMap[index] && itemMap[index].nneedesign === 3 ? true : false;
}

export function addDays(dateValue, daysToAdd) {
  const copy = new Date(Number(dateValue))
  copy.setDate(dateValue.getDate() + daysToAdd);
  return copy;
}

export function validatePhoneNumber(inputValue) {
  let output = "";
  // Get the regular expression to test against for this particular object
  let regAllow = /^[0-9,',',\n,\s,[,\], '+',-]+$/;
  // Check for an allowed character, if not found, cancel the keypress's event bubbling
  if (inputValue.match(regAllow)) {
    // Do nothing, i.e. allow.
    output = inputValue;
  }
  return output;
}

export function validateEmail(inputValue) {
  let output = false;
  //let regAllow = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //checks for presence of '@', '.' and 2 characters after '.'
  //let regAllow = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //let regAllow = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;

  //A form with an email field that that must be in the following order: characters@characters.domain 
  //(characters followed by an @ sign, followed by more characters, and then a ".". After the "." sign, you can only write 2 to 3 letters from a to z:
  let regAllow = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

  // Check for an allowed character, if not found, cancel the keypress's event bubbling
  if (inputValue.match(regAllow)) {

    // Do nothing, i.e. allow.
    output = true;//inputValue;
  }
  return output;
}

export function formatInputDate(date, includeMilliseconds) {
  let formattedDate = "";
  if (includeMilliseconds) {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) +
      'T' +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2)
      + "." +
      ("000" + date.getMilliseconds()).slice(-3) + "Z";
  }
  else {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) +
      'T' +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2) + "Z";
  }
  return formattedDate;
}

export function formatInputDateWithoutT(date, includeMilliseconds) {
  let formattedDate = "";
  if (includeMilliseconds) {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2)
      + "." +
      ("000" + date.getMilliseconds()).slice(-3);
  }
  else {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
  }
  return formattedDate;
}

export function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r && 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

//added by perumalraj on 03/11/2020
//compare two arrays of object and filter the record which are not present in the second array and vice versa
export function filterRecordBasedOnTwoArrays(firstArray, secondArray, PrimaryKey) {
  const filterArray = firstArray.filter(function (x) {
    return !secondArray.some(function (y) {
      return x[PrimaryKey] === y[PrimaryKey]
    })
  });
  return filterArray;
}

export function listDataFromDynamicArray(arr, indexvalue) {
  return arr && arr.filter(x => x[indexvalue]);
}

// export const fileViewURL = 'http://192.168.0.79:8097/';

//Added by P.Sudharshanan
export function replaceUpdatedObject(newList, oldList, primaryKey) {
  newList && newList.length > 0 && newList.map(newlistItem => {
    let oldIndex = oldList ? oldList.findIndex(x => x[primaryKey] === newlistItem[primaryKey]) : -1
    oldList.splice(oldIndex, 1, newlistItem)
    return null;
  })
  return oldList;
}
//added by perumalraj for insert newly added element into an array
export function updatedObjectWithNewElement(oldList, newList) {
  oldList = [...newList, ...oldList];
  return oldList;
}
//added by perumalraj for replace the old values wih new one into an array
export function replaceObjectWithNewElement(oldList) {
  oldList = [...oldList];
  return oldList;
}

//Added by L.Subashini to find the index positions nf the occurence of the specified character
// export const findIndices = (str, char) =>
//   str.split('').reduce((indices, letter, index) => {
//     letter === char && indices.push(index);
//     return indices;
//   }, [])

//added by perumalraj on 23/12/2020
//compare two arrays of object and filter the record which are not present in the second array and vice versa
export function filterStatusBasedOnTwoArrays(firstArray, secondArray, PrimaryKey, colorColName) {
  // const Peru = Object.keys(Array2).map(function (k) { return Array2[k][PrimaryKey] }).join(",");
  // alert(Peru);
  //const TestSet = new Set(Peru);
  // const FinalOutput = [
  //   ...Array1.filter(({ PrimaryKey }) => !TestSet.has(PrimaryKey))
  // ];
  // Array1 = Array1.filter(val => !Array2.includes(val[PrimaryKey]));
  // alert(Array1)
  // return Array1;
  const filterArray = firstArray.filter(function (x) {
    return secondArray.some(function (y) {
      if (x[PrimaryKey] === y[PrimaryKey]) {
        x[colorColName] = y[colorColName];
      }
      return x[PrimaryKey] === y[PrimaryKey]
    })
  });
  return filterArray;
}

export function constructOptionList(options, optionId, optionValue, sortField, sortOrder, alphabeticalSort, defaultStatusFieldName) {
  const optionMap = new Map();
  const defaultValue = [];
  const defaultStatus = defaultStatusFieldName ? defaultStatusFieldName : "ndefaultstatus";
  const optionList = Object.values((sortField ? ((sortOrder === "ascending" ?
    options.sort((itemA, itemB) => itemA[sortField] < itemB[sortField] ? -1 : 1)
    : options.sort((itemA, itemB) => itemA[sortField] > itemB[sortField] ? -1 : 1))
  )
    : (alphabeticalSort ?
      options.sort((itemA, itemB) =>
      (typeof (itemA[optionValue]) === 'string' ?
        itemA[optionValue].toLowerCase() < itemB[optionValue].toLowerCase() ?
          -1 : 1 : itemA[optionValue] < itemB[optionValue] ? -1 : 1)) : options)
  )
  ).map(item => {
    if (item[defaultStatus] === transactionStatus.YES) {
      (defaultValue.push({ label: item[optionValue], value: item[optionId], item: item }))
    }
    return { label: item[optionValue], value: item[optionId], item: item }
  });
  optionMap.set("OptionList", optionList);
  if (defaultValue.length > 0) {
    optionMap.set("DefaultValue", defaultValue[0]);
  }
  return optionMap;
}

export function constructjsonOptionList(options, optionId, optionValue, sortField, sortOrder, alphabeticalSort, defaultStatusFieldName, source) {
  const optionMap = new Map();
  const defaultValue = [];
  const defaultStatus = defaultStatusFieldName ? defaultStatusFieldName : "ndefaultstatus";
  const optionList = Object.values((sortField ? ((sortOrder === "ascending" ?
    options.sort((itemA, itemB) => JSON.parse(itemA[source].value)[sortField] < JSON.parse(itemB[source].value)[sortField] ? -1 : 1)
    : options.sort((itemA, itemB) => JSON.parse(itemA[source].value)[sortField] > JSON.parse(itemB[source].value)[sortField] ? -1 : 1))
  )
    : (alphabeticalSort ?
      options.sort((itemA, itemB) =>
      (typeof (JSON.parse(itemA[source].value)[optionValue]) === 'string' ?
        JSON.parse(itemA[source].value)[optionValue].toLowerCase() < JSON.parse(itemB[source].value)[optionValue].toLowerCase() ?
          -1 : 1 : JSON.parse(itemA[source].value)[optionValue] < JSON.parse(itemB[source].value)[optionValue] ? -1 : 1)) : options)
  )
  ).map(item => {
    const jsondata = JSON.parse(item[source].value)
    if (jsondata[defaultStatus] === transactionStatus.YES) {
      (defaultValue.push({ label: jsondata[optionValue], value: jsondata[optionId], item: jsondata }))
    }
    return { label: jsondata[optionValue], value: jsondata[optionId], item: jsondata }
  });
  optionMap.set("OptionList", optionList);
  if (defaultValue.length > 0) {
    optionMap.set("DefaultValue", defaultValue[0]);
  }
  return optionMap;
}

export function validateLoginId(inputValue) {
  let output = false;
  //let regAllow = /^\w+(\w+)*$/;
  let regAllow = /^[a-zA-Z0-9-_]*$/;
  //let regAllow = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;
  if (inputValue.match(regAllow)) {
    output = true;
  }
  return output;
}

//added by perumalraj on 02-02-2021 for single click java function in list master view and 
export function fillRecordBasedOnCheckBoxSelection(masterData, backEndResponse, mapKeys, CheckBoxOperation, primaryKeyName, removeElementFromArray) {
  if (CheckBoxOperation === 1) {  //check box select
    mapKeys.forEach((item) => {
      return masterData[item] = updatedObjectWithNewElement(masterData[item] ? masterData[item] : [], backEndResponse[item] ? backEndResponse[item] : []);
    });
  } else if (CheckBoxOperation === 2) {  //check box de-select
    mapKeys.forEach((item) => {
      return masterData[item] = filterRecordBasedOnPrimaryKeyName(masterData[item] ? masterData[item] : [], removeElementFromArray.length > 0 && removeElementFromArray[0][primaryKeyName] ? removeElementFromArray[0][primaryKeyName] : "", primaryKeyName);
    });
  } else if (CheckBoxOperation === 3) {  //single select
    mapKeys.forEach((item) => {
      return masterData[item] = replaceObjectWithNewElement(backEndResponse[item] ? backEndResponse[item] : []);
    })
  } else if (CheckBoxOperation === 4) {  //single de-select
    mapKeys.forEach((item) => {
      return masterData[item] = getRecordBasedOnPrimaryKeyName(masterData[item] ? masterData[item] : [], backEndResponse.length > 0 && backEndResponse[0][primaryKeyName] ? backEndResponse[0][primaryKeyName] : "", primaryKeyName);
    });

    // return masterData[item] = replaceObjectWithNewElement(masterData[item] ? masterData[item] : [], backEndResponse[item] ? backEndResponse[item] : []);
  } else if (CheckBoxOperation === 5) {  //after multi select and then click single record
    mapKeys.forEach((item) => {
      let filteredmasterData = filterRecordBasedOnTwoArrays(masterData[item] ? masterData[item] : [], removeElementFromArray, primaryKeyName);
      return masterData[item] = updatedObjectWithNewElement(filteredmasterData, backEndResponse[item] ? backEndResponse[item] : []);
    });
  } else if (CheckBoxOperation === 6) {  //after multi select and then click single record
    mapKeys.forEach((item) => {
      filterRecordBasedOnTwoArrays(masterData[item] ? masterData[item] : [], removeElementFromArray, primaryKeyName);
      return masterData[item] = getSameRecordFromTwoArrays(masterData[item] ? masterData[item] : [], backEndResponse ? backEndResponse : [], primaryKeyName);
    });
  } else {
    Object.keys(backEndResponse).forEach((item) => {
      return masterData[item] = backEndResponse[item]
    })
  }
}
//added by perumalraj on 02-02-2021
export function filterRecordBasedOnPrimaryKeyName(masterData, value, primaryKeyName) {
  const finalValueAfterFilter = masterData.filter(function (master) {
    return master[primaryKeyName] !== value;
  });
  return finalValueAfterFilter;
}

//added by perumalraj on 02-02-2021
export function getRecordBasedOnPrimaryKeyName(masterData, value, primaryKeyName) {
  const finalValueAfterFilter = masterData.filter(function (master) {
    return master[primaryKeyName] === value;
  });
  return finalValueAfterFilter;
}

//added by perumalraj on 06/02/2021
//compare two arrays of object and filter the record which are not present in the second array and first array data will be 
//returned with the filtered data
export function getSameRecordFromTwoArrays(firstArray, secondArray, PrimaryKey) {
  const filterArray = firstArray.filter(function (x) {
    if (Array.isArray(secondArray)) {
      return secondArray.some(function (y) {
        return x[PrimaryKey] === y[PrimaryKey]
      })
    }
  });
  return filterArray;

}

//added by perumalraj on 16-02-2021
//compare two arrays and remove the same element and add the newer one into it
export function getRemovedRecordAndAddNewRecord(firstArray, secondArray, ElementToSearch, PrimaryKey) {
  ElementToSearch.forEach(item => {
    let itemAfterfilter = filterRecordBasedOnPrimaryKeyName(firstArray, item, PrimaryKey);
    firstArray = itemAfterfilter;
  });
  return updatedObjectWithNewElement(firstArray, secondArray);
}

export function bytesToSize(bytes) {
  if (!isNaN(parseInt(bytes))) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  } else {
    return bytes;
  }
}

export function onDropAttachFileList(selectedRecord, attachedFiles, maxSize) {
  if (selectedRecord) {
    let listFile = selectedRecord ? selectedRecord : []
    if (listFile.length + attachedFiles.length <= maxSize || maxSize === 0) {
      attachedFiles && attachedFiles.length > 0 && attachedFiles.map(newlistItem => {
        let oldIndex = listFile ? listFile.findIndex(x => x['name'] === newlistItem['name']) : -1
        if (oldIndex === -1) {
          listFile.splice(listFile.length, 0, newlistItem)
        } else {
          listFile.splice(oldIndex, 1, newlistItem)
        }
        return null;
      })
      return listFile;
    }
    return attachedFiles;
  } else {
    return attachedFiles;
  }
}

export function deleteAttachmentDropZone(selectedRecord, file) {
  let remainingList;
  if (typeof selectedRecord === "string") {
    remainingList = "";
  }
  else {
    if (selectedRecord.length >= 1) {
      const fileList = selectedRecord.filter(fileItem => {
        return fileItem.name !== file.name
      })
      remainingList = fileList;
    }
    else {
      remainingList = "";
    }
  }
  return remainingList;
}

export function checkCancelAndReject(sample) {
  return (sample.ntransactionstatus === transactionStatus.CANCELLED || sample.ntransactionstatus === transactionStatus.REJECT)
}

export function covertDatetoString(newDate) {
  const startDate = new Date(newDate);
  const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
  const prevDay = validateTwoDigitDate(String(startDate.getDate()));
  const fromDate = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
  return fromDate;
}

export function convertDatetoStringByTimeZone(userInfo, value) {

  const dateValue = new Date(value);
  const prevMonth = validateTwoDigitDate(String(dateValue.getMonth() + 1));
  const prevDay = validateTwoDigitDate(String(dateValue.getDate()));
  const dateArray = [];

  const splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";
  const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
  const secondField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[1];

  if (firstField === "dd") {
    dateArray.push(prevDay);
    dateArray.push(splitChar);
    if (secondField === "MM") {
      dateArray.push(prevMonth);
      dateArray.push(splitChar);
      dateArray.push(dateValue.getFullYear());
    }
    else {
      dateArray.push(dateValue.getFullYear());
      dateArray.push(splitChar);
      dateArray.push(prevMonth);
    }
  }
  else if (firstField === "MM") {
    dateArray.push(prevMonth);
    dateArray.push(splitChar);
    if (secondField === "dd") {
      dateArray.push(prevDay);
      dateArray.push(splitChar);
      dateArray.push(dateValue.getFullYear());
    }
    else {
      dateArray.push(dateValue.getFullYear());
      dateArray.push(splitChar);
      dateArray.push(prevDay);
    }
  }
  else {
    dateArray.push(dateValue.getFullYear());
    dateArray.push(splitChar);
    if (secondField === "dd") {
      dateArray.push(prevDay);
      dateArray.push(splitChar);
      dateArray.push(prevMonth);
    }
    else {
      dateArray.push(prevMonth);
      dateArray.push(splitChar);
      dateArray.push(prevDay);
    }
  }
  return dateArray;
}

export function convertDateValuetoString(startDateValue, endDateValue, userInfo, noBreadCrumb) {

  const startDate = startDateValue ? rearrangeDateFormat(userInfo, startDateValue) : new Date();
  const endDate = endDateValue ? rearrangeDateFormat(userInfo, endDateValue) : new Date();

  // const startDate = startDateValue ? new Date(startDateValue) : new Date();
  // const endDate = endDateValue ? new Date(endDateValue) : new Date();

  const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
  const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
  const prevDay = validateTwoDigitDate(String(startDate.getDate()));
  const currentDay = validateTwoDigitDate(String(endDate.getDate()));

  //const splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";
  const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
  const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;
  const fromDate = fromDateOnly + "T00:00:00";
  const toDate = toDateOnly + "T23:59:59";

  if (noBreadCrumb) {
    return ({ fromDate, toDate });
  }
  else {
    const breadCrumbFrom = convertDatetoStringByTimeZone(userInfo, startDate);//startDate.getFullYear() + splitChar + prevMonth + splitChar + prevDay;
    const breadCrumbto = convertDatetoStringByTimeZone(userInfo, endDate);//endDate.getFullYear() + splitChar + currentMonth + splitChar + currentDay;

    return ({ fromDate, toDate, breadCrumbFrom, breadCrumbto });
  }

}

export function rearrangeDateFormat(userInfo, dateValue) {

  let splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";
  //   console.log("splitChar:", splitChar);
  if ((splitChar === "/" || splitChar === "-") && typeof dateValue === "string") {
    const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
    // console.log("firstField:", firstField);
    const timeSplitChar = dateValue.indexOf("T") !== -1 ? "T" : " "
    const datetime = dateValue.split(timeSplitChar);
    const dateArray = datetime[0].split(splitChar);
    if (firstField === "dd") {
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];
      const time = datetime[1] || "00:00:00";

      const formatted = year + "-" + month + "-" + day + "T" + time;
      return new Date(formatted);
    }
    else if (firstField === "yyyy") {
      const year = dateArray[0];
      const month = dateArray[1];
      const day = dateArray[2];
      const time = datetime[1] || "00:00:00";
      const formatted = year + "-" + month + "-" + day + "T" + time;
      return new Date(formatted);
    }
    else {
      return new Date(dateValue);
    }
  }
  else {
    return dateValue;
  }
}

export function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export function convertDateTimetoString(inputDate, userInfo) {

  let splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";

  const month = validateTwoDigitDate(String(inputDate.getMonth() + 1));
  const day = validateTwoDigitDate(String(inputDate.getDate()));
  const year = inputDate.getFullYear();
  const hours = validateTwoDigitDate(String(inputDate.getHours()));
  const minutes = validateTwoDigitDate(String(inputDate.getMinutes()));
  const seconds = validateTwoDigitDate(String(inputDate.getSeconds()));

  if (splitChar === "/" || splitChar === "-") {
    const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
    if (firstField === "dd") {
      return day + splitChar + month + splitChar + year + " " + hours + ":" + minutes + ":" + seconds;
    } else if (firstField === "yyyy") {
      return year + splitChar + month + splitChar + day + "T" + hours + ":" + minutes + ":" + seconds;
    } else {
      return new Date(inputDate);
    }
  } else {
    return inputDate;
  }
}

export function parentChildComboLoad(columnList, comboData, selectedRecord, childColumnList,withoutCombocomponent,ParentComboValues) {
  let comboValues = {}
  columnList.map(x => {
    if(x.inputtype==='combo'){
    if (comboData[x.label][0].hasOwnProperty(x.source)) {
      selectedRecord[x.label] = undefined;
      const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
        x.displaymember, false, false, true, undefined, x.source)
      comboData[x.label] = optionList.get("OptionList");
      if (optionList.get("DefaultValue") !== undefined) {
        selectedRecord[x.label] = optionList.get("DefaultValue")
      }
      comboValues = childComboLoad(x, comboData, selectedRecord, childColumnList,withoutCombocomponent)
    }
  }else{
    comboValues["selectedRecord"][x.label] = ParentComboValues[x.displaymember]
  }
  })
  return comboValues;
}


export function childComboLoad(x, comboData, selectedRecord, childColumnList,withoutCombocomponent) {
  if (selectedRecord[x.label] !== undefined) {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        const index = childColumnList[x.label].findIndex(z => z.label === y.label)
        if(index!==-1){
        // const childOptionData = comboData[y.label].filter(filterData =>
        //     JSON.parse(filterData[y.source].value)[x.valuemember] === selectedRecord[x.label].item[x.valuemember])
        const optionChildList = constructjsonOptionList(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
          childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source)
        comboData[y.label] = optionChildList.get("OptionList");
        if (optionChildList.get("DefaultValue") !== undefined) {
          selectedRecord[y.label] = optionChildList.get("DefaultValue")
          childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList,withoutCombocomponent)
        } else {
          selectedRecord[y.label] = undefined
        }
      }else{
        const readonlyfields=withoutCombocomponent.findIndex(k=>k.label===y.label);
        if(readonlyfields!==-1){
        selectedRecord[withoutCombocomponent[readonlyfields]["label"]]=selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]]
        }
      }
      })
    }
  } else {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        selectedRecord[y.label] = undefined
        comboData[y.label] = undefined
      })
    }
  }
  const newRecord = {
    "comboData": comboData,
    "selectedRecord": selectedRecord
  }
  return newRecord;
}