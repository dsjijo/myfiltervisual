/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

/*! powerbi-models v1.1.0 | (c) 2016 Microsoft Corporation MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["powerbi-models"] = factory();
	else
		root["powerbi-models"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Validators = __webpack_require__(1).Validators;
	var TraceType;
	(function (TraceType) {
	    TraceType[TraceType["Information"] = 0] = "Information";
	    TraceType[TraceType["Verbose"] = 1] = "Verbose";
	    TraceType[TraceType["Warning"] = 2] = "Warning";
	    TraceType[TraceType["Error"] = 3] = "Error";
	    TraceType[TraceType["ExpectedError"] = 4] = "ExpectedError";
	    TraceType[TraceType["UnexpectedError"] = 5] = "UnexpectedError";
	    TraceType[TraceType["Fatal"] = 6] = "Fatal";
	})(TraceType = exports.TraceType || (exports.TraceType = {}));
	var PageSizeType;
	(function (PageSizeType) {
	    PageSizeType[PageSizeType["Widescreen"] = 0] = "Widescreen";
	    PageSizeType[PageSizeType["Standard"] = 1] = "Standard";
	    PageSizeType[PageSizeType["Cortana"] = 2] = "Cortana";
	    PageSizeType[PageSizeType["Letter"] = 3] = "Letter";
	    PageSizeType[PageSizeType["Custom"] = 4] = "Custom";
	})(PageSizeType = exports.PageSizeType || (exports.PageSizeType = {}));
	var DisplayOption;
	(function (DisplayOption) {
	    DisplayOption[DisplayOption["FitToPage"] = 0] = "FitToPage";
	    DisplayOption[DisplayOption["FitToWidth"] = 1] = "FitToWidth";
	    DisplayOption[DisplayOption["ActualSize"] = 2] = "ActualSize";
	})(DisplayOption = exports.DisplayOption || (exports.DisplayOption = {}));
	var BackgroundType;
	(function (BackgroundType) {
	    BackgroundType[BackgroundType["Default"] = 0] = "Default";
	    BackgroundType[BackgroundType["Transparent"] = 1] = "Transparent";
	})(BackgroundType = exports.BackgroundType || (exports.BackgroundType = {}));
	var VisualContainerDisplayMode;
	(function (VisualContainerDisplayMode) {
	    VisualContainerDisplayMode[VisualContainerDisplayMode["Visible"] = 0] = "Visible";
	    VisualContainerDisplayMode[VisualContainerDisplayMode["Hidden"] = 1] = "Hidden";
	})(VisualContainerDisplayMode = exports.VisualContainerDisplayMode || (exports.VisualContainerDisplayMode = {}));
	var LayoutType;
	(function (LayoutType) {
	    LayoutType[LayoutType["Master"] = 0] = "Master";
	    LayoutType[LayoutType["Custom"] = 1] = "Custom";
	    LayoutType[LayoutType["MobilePortrait"] = 2] = "MobilePortrait";
	    LayoutType[LayoutType["MobileLandscape"] = 3] = "MobileLandscape";
	})(LayoutType = exports.LayoutType || (exports.LayoutType = {}));
	var SectionVisibility;
	(function (SectionVisibility) {
	    SectionVisibility[SectionVisibility["AlwaysVisible"] = 0] = "AlwaysVisible";
	    SectionVisibility[SectionVisibility["HiddenInViewMode"] = 1] = "HiddenInViewMode";
	})(SectionVisibility = exports.SectionVisibility || (exports.SectionVisibility = {}));
	var Permissions;
	(function (Permissions) {
	    Permissions[Permissions["Read"] = 0] = "Read";
	    Permissions[Permissions["ReadWrite"] = 1] = "ReadWrite";
	    Permissions[Permissions["Copy"] = 2] = "Copy";
	    Permissions[Permissions["Create"] = 4] = "Create";
	    Permissions[Permissions["All"] = 7] = "All";
	})(Permissions = exports.Permissions || (exports.Permissions = {}));
	var ViewMode;
	(function (ViewMode) {
	    ViewMode[ViewMode["View"] = 0] = "View";
	    ViewMode[ViewMode["Edit"] = 1] = "Edit";
	})(ViewMode = exports.ViewMode || (exports.ViewMode = {}));
	var TokenType;
	(function (TokenType) {
	    TokenType[TokenType["Aad"] = 0] = "Aad";
	    TokenType[TokenType["Embed"] = 1] = "Embed";
	})(TokenType = exports.TokenType || (exports.TokenType = {}));
	var MenuLocation;
	(function (MenuLocation) {
	    MenuLocation[MenuLocation["Bottom"] = 0] = "Bottom";
	    MenuLocation[MenuLocation["Top"] = 1] = "Top";
	})(MenuLocation = exports.MenuLocation || (exports.MenuLocation = {}));
	var FiltersLevel;
	(function (FiltersLevel) {
	    FiltersLevel[FiltersLevel["Report"] = 0] = "Report";
	    FiltersLevel[FiltersLevel["Page"] = 1] = "Page";
	    FiltersLevel[FiltersLevel["Visual"] = 2] = "Visual";
	})(FiltersLevel = exports.FiltersLevel || (exports.FiltersLevel = {}));
	var FilterType;
	(function (FilterType) {
	    FilterType[FilterType["Advanced"] = 0] = "Advanced";
	    FilterType[FilterType["Basic"] = 1] = "Basic";
	    FilterType[FilterType["Unknown"] = 2] = "Unknown";
	    FilterType[FilterType["IncludeExclude"] = 3] = "IncludeExclude";
	    FilterType[FilterType["RelativeDate"] = 4] = "RelativeDate";
	    FilterType[FilterType["TopN"] = 5] = "TopN";
	    FilterType[FilterType["Tuple"] = 6] = "Tuple";
	})(FilterType = exports.FilterType || (exports.FilterType = {}));
	var RelativeDateFilterTimeUnit;
	(function (RelativeDateFilterTimeUnit) {
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Days"] = 0] = "Days";
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Weeks"] = 1] = "Weeks";
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["CalendarWeeks"] = 2] = "CalendarWeeks";
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Months"] = 3] = "Months";
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["CalendarMonths"] = 4] = "CalendarMonths";
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Years"] = 5] = "Years";
	    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["CalendarYears"] = 6] = "CalendarYears";
	})(RelativeDateFilterTimeUnit = exports.RelativeDateFilterTimeUnit || (exports.RelativeDateFilterTimeUnit = {}));
	var RelativeDateOperators;
	(function (RelativeDateOperators) {
	    RelativeDateOperators[RelativeDateOperators["InLast"] = 0] = "InLast";
	    RelativeDateOperators[RelativeDateOperators["InThis"] = 1] = "InThis";
	    RelativeDateOperators[RelativeDateOperators["InNext"] = 2] = "InNext";
	})(RelativeDateOperators = exports.RelativeDateOperators || (exports.RelativeDateOperators = {}));
	var Filter = /** @class */ (function () {
	    function Filter(target, filterType) {
	        this.target = target;
	        this.filterType = filterType;
	    }
	    Filter.prototype.toJSON = function () {
	        return {
	            $schema: this.schemaUrl,
	            target: this.target,
	            filterType: this.filterType
	        };
	    };
	    ;
	    return Filter;
	}());
	exports.Filter = Filter;
	var NotSupportedFilter = /** @class */ (function (_super) {
	    __extends(NotSupportedFilter, _super);
	    function NotSupportedFilter(target, message, notSupportedTypeName) {
	        var _this = _super.call(this, target, FilterType.Unknown) || this;
	        _this.message = message;
	        _this.notSupportedTypeName = notSupportedTypeName;
	        _this.schemaUrl = NotSupportedFilter.schemaUrl;
	        return _this;
	    }
	    NotSupportedFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.message = this.message;
	        filter.notSupportedTypeName = this.notSupportedTypeName;
	        return filter;
	    };
	    NotSupportedFilter.schemaUrl = "http://powerbi.com/product/schema#notSupported";
	    return NotSupportedFilter;
	}(Filter));
	exports.NotSupportedFilter = NotSupportedFilter;
	var IncludeExcludeFilter = /** @class */ (function (_super) {
	    __extends(IncludeExcludeFilter, _super);
	    function IncludeExcludeFilter(target, isExclude, values) {
	        var _this = _super.call(this, target, FilterType.IncludeExclude) || this;
	        _this.values = values;
	        _this.isExclude = isExclude;
	        _this.schemaUrl = IncludeExcludeFilter.schemaUrl;
	        return _this;
	    }
	    IncludeExcludeFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.isExclude = this.isExclude;
	        filter.values = this.values;
	        return filter;
	    };
	    IncludeExcludeFilter.schemaUrl = "http://powerbi.com/product/schema#includeExclude";
	    return IncludeExcludeFilter;
	}(Filter));
	exports.IncludeExcludeFilter = IncludeExcludeFilter;
	var TopNFilter = /** @class */ (function (_super) {
	    __extends(TopNFilter, _super);
	    function TopNFilter(target, operator, itemCount) {
	        var _this = _super.call(this, target, FilterType.TopN) || this;
	        _this.operator = operator;
	        _this.itemCount = itemCount;
	        _this.schemaUrl = TopNFilter.schemaUrl;
	        return _this;
	    }
	    TopNFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.operator = this.operator;
	        filter.itemCount = this.itemCount;
	        return filter;
	    };
	    TopNFilter.schemaUrl = "http://powerbi.com/product/schema#topN";
	    return TopNFilter;
	}(Filter));
	exports.TopNFilter = TopNFilter;
	var RelativeDateFilter = /** @class */ (function (_super) {
	    __extends(RelativeDateFilter, _super);
	    function RelativeDateFilter(target, operator, timeUnitsCount, timeUnitType, includeToday) {
	        var _this = _super.call(this, target, FilterType.RelativeDate) || this;
	        _this.operator = operator;
	        _this.timeUnitsCount = timeUnitsCount;
	        _this.timeUnitType = timeUnitType;
	        _this.includeToday = includeToday;
	        _this.schemaUrl = RelativeDateFilter.schemaUrl;
	        return _this;
	    }
	    RelativeDateFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.operator = this.operator;
	        filter.timeUnitsCount = this.timeUnitsCount;
	        filter.timeUnitType = this.timeUnitType;
	        filter.includeToday = this.includeToday;
	        return filter;
	    };
	    RelativeDateFilter.schemaUrl = "http://powerbi.com/product/schema#relativeDate";
	    return RelativeDateFilter;
	}(Filter));
	exports.RelativeDateFilter = RelativeDateFilter;
	var BasicFilter = /** @class */ (function (_super) {
	    __extends(BasicFilter, _super);
	    function BasicFilter(target, operator) {
	        var values = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            values[_i - 2] = arguments[_i];
	        }
	        var _this = _super.call(this, target, FilterType.Basic) || this;
	        _this.operator = operator;
	        _this.schemaUrl = BasicFilter.schemaUrl;
	        if (values.length === 0 && operator !== "All") {
	            throw new Error("values must be a non-empty array unless your operator is \"All\".");
	        }
	        /**
	         * Accept values as array instead of as individual arguments
	         * new BasicFilter('a', 'b', 1, 2);
	         * new BasicFilter('a', 'b', [1,2]);
	         */
	        if (Array.isArray(values[0])) {
	            _this.values = values[0];
	        }
	        else {
	            _this.values = values;
	        }
	        return _this;
	    }
	    BasicFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.operator = this.operator;
	        filter.values = this.values;
	        return filter;
	    };
	    BasicFilter.schemaUrl = "http://powerbi.com/product/schema#basic";
	    return BasicFilter;
	}(Filter));
	exports.BasicFilter = BasicFilter;
	var BasicFilterWithKeys = /** @class */ (function (_super) {
	    __extends(BasicFilterWithKeys, _super);
	    function BasicFilterWithKeys(target, operator, values, keyValues) {
	        var _this = _super.call(this, target, operator, values) || this;
	        _this.keyValues = keyValues;
	        _this.target = target;
	        var numberOfKeys = target.keys ? target.keys.length : 0;
	        if (numberOfKeys > 0 && !keyValues) {
	            throw new Error("You should pass the values to be filtered for each key. You passed: no values and " + numberOfKeys + " keys");
	        }
	        if (numberOfKeys === 0 && keyValues && keyValues.length > 0) {
	            throw new Error("You passed key values but your target object doesn't contain the keys to be filtered");
	        }
	        for (var i = 0; i < _this.keyValues.length; i++) {
	            if (_this.keyValues[i]) {
	                var lengthOfArray = _this.keyValues[i].length;
	                if (lengthOfArray !== numberOfKeys) {
	                    throw new Error("Each tuple of key values should contain a value for each of the keys. You passed: " + lengthOfArray + " values and " + numberOfKeys + " keys");
	                }
	            }
	        }
	        return _this;
	    }
	    BasicFilterWithKeys.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.keyValues = this.keyValues;
	        return filter;
	    };
	    return BasicFilterWithKeys;
	}(BasicFilter));
	exports.BasicFilterWithKeys = BasicFilterWithKeys;
	var TupleFilter = /** @class */ (function (_super) {
	    __extends(TupleFilter, _super);
	    function TupleFilter(target, operator, values) {
	        var _this = _super.call(this, target, FilterType.Tuple) || this;
	        _this.operator = operator;
	        _this.schemaUrl = TupleFilter.schemaUrl;
	        _this.values = values;
	        return _this;
	    }
	    TupleFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.operator = this.operator;
	        filter.values = this.values;
	        filter.target = this.target;
	        return filter;
	    };
	    TupleFilter.schemaUrl = "http://powerbi.com/product/schema#tuple";
	    return TupleFilter;
	}(Filter));
	exports.TupleFilter = TupleFilter;
	var AdvancedFilter = /** @class */ (function (_super) {
	    __extends(AdvancedFilter, _super);
	    function AdvancedFilter(target, logicalOperator) {
	        var conditions = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            conditions[_i - 2] = arguments[_i];
	        }
	        var _this = _super.call(this, target, FilterType.Advanced) || this;
	        _this.schemaUrl = AdvancedFilter.schemaUrl;
	        // Guard statements
	        if (typeof logicalOperator !== "string" || logicalOperator.length === 0) {
	            // TODO: It would be nicer to list out the possible logical operators.
	            throw new Error("logicalOperator must be a valid operator, You passed: " + logicalOperator);
	        }
	        _this.logicalOperator = logicalOperator;
	        var extractedConditions;
	        /**
	         * Accept conditions as array instead of as individual arguments
	         * new AdvancedFilter('a', 'b', "And", { value: 1, operator: "Equals" }, { value: 2, operator: "IsGreaterThan" });
	         * new AdvancedFilter('a', 'b', "And", [{ value: 1, operator: "Equals" }, { value: 2, operator: "IsGreaterThan" }]);
	         */
	        if (Array.isArray(conditions[0])) {
	            extractedConditions = conditions[0];
	        }
	        else {
	            extractedConditions = conditions;
	        }
	        if (extractedConditions.length === 0) {
	            throw new Error("conditions must be a non-empty array. You passed: " + conditions);
	        }
	        if (extractedConditions.length > 2) {
	            throw new Error("AdvancedFilters may not have more than two conditions. You passed: " + conditions.length);
	        }
	        if (extractedConditions.length === 1 && logicalOperator !== "And") {
	            throw new Error("Logical Operator must be \"And\" when there is only one condition provided");
	        }
	        _this.conditions = extractedConditions;
	        return _this;
	    }
	    AdvancedFilter.prototype.toJSON = function () {
	        var filter = _super.prototype.toJSON.call(this);
	        filter.logicalOperator = this.logicalOperator;
	        filter.conditions = this.conditions;
	        return filter;
	    };
	    AdvancedFilter.schemaUrl = "http://powerbi.com/product/schema#advanced";
	    return AdvancedFilter;
	}(Filter));
	exports.AdvancedFilter = AdvancedFilter;
	function isFilterKeyColumnsTarget(target) {
	    return isColumn(target) && !!target.keys;
	}
	exports.isFilterKeyColumnsTarget = isFilterKeyColumnsTarget;
	function isBasicFilterWithKeys(filter) {
	    return getFilterType(filter) === FilterType.Basic && !!filter.keyValues;
	}
	exports.isBasicFilterWithKeys = isBasicFilterWithKeys;
	function getFilterType(filter) {
	    if (filter.filterType) {
	        return filter.filterType;
	    }
	    var basicFilter = filter;
	    var advancedFilter = filter;
	    if ((typeof basicFilter.operator === "string")
	        && (Array.isArray(basicFilter.values))) {
	        return FilterType.Basic;
	    }
	    else if ((typeof advancedFilter.logicalOperator === "string")
	        && (Array.isArray(advancedFilter.conditions))) {
	        return FilterType.Advanced;
	    }
	    else {
	        return FilterType.Unknown;
	    }
	}
	exports.getFilterType = getFilterType;
	function isMeasure(arg) {
	    return arg.table !== undefined && arg.measure !== undefined;
	}
	exports.isMeasure = isMeasure;
	function isColumn(arg) {
	    return arg.table !== undefined && arg.column !== undefined;
	}
	exports.isColumn = isColumn;
	function isHierarchy(arg) {
	    return arg.table !== undefined && arg.hierarchy !== undefined && arg.hierarchyLevel !== undefined;
	}
	exports.isHierarchy = isHierarchy;
	var QnaMode;
	(function (QnaMode) {
	    QnaMode[QnaMode["Interactive"] = 0] = "Interactive";
	    QnaMode[QnaMode["ResultOnly"] = 1] = "ResultOnly";
	})(QnaMode = exports.QnaMode || (exports.QnaMode = {}));
	var ExportDataType;
	(function (ExportDataType) {
	    ExportDataType[ExportDataType["Summarized"] = 0] = "Summarized";
	    ExportDataType[ExportDataType["Underlying"] = 1] = "Underlying";
	})(ExportDataType = exports.ExportDataType || (exports.ExportDataType = {}));
	var BookmarksPlayMode;
	(function (BookmarksPlayMode) {
	    BookmarksPlayMode[BookmarksPlayMode["Off"] = 0] = "Off";
	    BookmarksPlayMode[BookmarksPlayMode["Presentation"] = 1] = "Presentation";
	})(BookmarksPlayMode = exports.BookmarksPlayMode || (exports.BookmarksPlayMode = {}));
	// This is not an enum because enum strings require
	// us to upgrade typeScript version and change SDK build definition
	exports.CommonErrorCodes = {
	    TokenExpired: 'TokenExpired',
	    NotFound: 'PowerBIEntityNotFound',
	    InvalidParameters: 'Invalid parameters',
	    LoadReportFailed: 'LoadReportFailed',
	    NotAuthorized: 'PowerBINotAuthorizedException',
	    FailedToLoadModel: 'ExplorationContainer_FailedToLoadModel_DefaultDetails',
	};
	var Selector = /** @class */ (function () {
	    function Selector(schema) {
	        this.$schema = schema;
	    }
	    Selector.prototype.toJSON = function () {
	        return {
	            $schema: this.$schema
	        };
	    };
	    ;
	    return Selector;
	}());
	exports.Selector = Selector;
	var PageSelector = /** @class */ (function (_super) {
	    __extends(PageSelector, _super);
	    function PageSelector(pageName) {
	        var _this = _super.call(this, PageSelector.schemaUrl) || this;
	        _this.pageName = pageName;
	        return _this;
	    }
	    PageSelector.prototype.toJSON = function () {
	        var selector = _super.prototype.toJSON.call(this);
	        selector.pageName = this.pageName;
	        return selector;
	    };
	    PageSelector.schemaUrl = "http://powerbi.com/product/schema#pageSelector";
	    return PageSelector;
	}(Selector));
	exports.PageSelector = PageSelector;
	var VisualSelector = /** @class */ (function (_super) {
	    __extends(VisualSelector, _super);
	    function VisualSelector(visualName) {
	        var _this = _super.call(this, VisualSelector.schemaUrl) || this;
	        _this.visualName = visualName;
	        return _this;
	    }
	    VisualSelector.prototype.toJSON = function () {
	        var selector = _super.prototype.toJSON.call(this);
	        selector.visualName = this.visualName;
	        return selector;
	    };
	    VisualSelector.schemaUrl = "http://powerbi.com/product/schema#visualSelector";
	    return VisualSelector;
	}(Selector));
	exports.VisualSelector = VisualSelector;
	var VisualTypeSelector = /** @class */ (function (_super) {
	    __extends(VisualTypeSelector, _super);
	    function VisualTypeSelector(visualType) {
	        var _this = _super.call(this, VisualSelector.schemaUrl) || this;
	        _this.visualType = visualType;
	        return _this;
	    }
	    VisualTypeSelector.prototype.toJSON = function () {
	        var selector = _super.prototype.toJSON.call(this);
	        selector.visualType = this.visualType;
	        return selector;
	    };
	    VisualTypeSelector.schemaUrl = "http://powerbi.com/product/schema#visualTypeSelector";
	    return VisualTypeSelector;
	}(Selector));
	exports.VisualTypeSelector = VisualTypeSelector;
	var SlicerTargetSelector = /** @class */ (function (_super) {
	    __extends(SlicerTargetSelector, _super);
	    function SlicerTargetSelector(target) {
	        var _this = _super.call(this, VisualSelector.schemaUrl) || this;
	        _this.target = target;
	        return _this;
	    }
	    SlicerTargetSelector.prototype.toJSON = function () {
	        var selector = _super.prototype.toJSON.call(this);
	        selector.target = this.target;
	        return selector;
	    };
	    SlicerTargetSelector.schemaUrl = "http://powerbi.com/product/schema#slicerTargetSelector";
	    return SlicerTargetSelector;
	}(Selector));
	exports.SlicerTargetSelector = SlicerTargetSelector;
	var CommandDisplayOption;
	(function (CommandDisplayOption) {
	    CommandDisplayOption[CommandDisplayOption["Enabled"] = 0] = "Enabled";
	    CommandDisplayOption[CommandDisplayOption["Disabled"] = 1] = "Disabled";
	    CommandDisplayOption[CommandDisplayOption["Hidden"] = 2] = "Hidden";
	})(CommandDisplayOption = exports.CommandDisplayOption || (exports.CommandDisplayOption = {}));
	function normalizeError(error) {
	    var message = error.message;
	    if (!message) {
	        message = error.path + " is invalid. Not meeting " + error.keyword + " constraint";
	    }
	    return {
	        message: message
	    };
	}
	function validateVisualSelector(input) {
	    var errors = exports.Validators.visualSelectorValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateVisualSelector = validateVisualSelector;
	function validateSlicer(input) {
	    var errors = exports.Validators.slicerValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateSlicer = validateSlicer;
	function validateSlicerState(input) {
	    var errors = exports.Validators.slicerStateValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateSlicerState = validateSlicerState;
	function validatePlayBookmarkRequest(input) {
	    var errors = exports.Validators.playBookmarkRequestValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validatePlayBookmarkRequest = validatePlayBookmarkRequest;
	function validateAddBookmarkRequest(input) {
	    var errors = exports.Validators.addBookmarkRequestValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateAddBookmarkRequest = validateAddBookmarkRequest;
	function validateApplyBookmarkByNameRequest(input) {
	    var errors = exports.Validators.applyBookmarkByNameRequestValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateApplyBookmarkByNameRequest = validateApplyBookmarkByNameRequest;
	function validateApplyBookmarkStateRequest(input) {
	    var errors = exports.Validators.applyBookmarkStateRequestValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateApplyBookmarkStateRequest = validateApplyBookmarkStateRequest;
	function validateSettings(input) {
	    var errors = exports.Validators.settingsValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateSettings = validateSettings;
	function validateCustomPageSize(input) {
	    var errors = exports.Validators.customPageSizeValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateCustomPageSize = validateCustomPageSize;
	function validateExtension(input) {
	    var errors = exports.Validators.extensionValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateExtension = validateExtension;
	function validateReportLoad(input) {
	    var errors = exports.Validators.reportLoadValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateReportLoad = validateReportLoad;
	function validateCreateReport(input) {
	    var errors = exports.Validators.reportCreateValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateCreateReport = validateCreateReport;
	function validateDashboardLoad(input) {
	    var errors = exports.Validators.dashboardLoadValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateDashboardLoad = validateDashboardLoad;
	function validateTileLoad(input) {
	    var errors = exports.Validators.tileLoadValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateTileLoad = validateTileLoad;
	function validatePage(input) {
	    var errors = exports.Validators.pageValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validatePage = validatePage;
	function validateFilter(input) {
	    var errors = exports.Validators.filtersValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateFilter = validateFilter;
	function validateSaveAsParameters(input) {
	    var errors = exports.Validators.saveAsParametersValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateSaveAsParameters = validateSaveAsParameters;
	function validateLoadQnaConfiguration(input) {
	    var errors = exports.Validators.loadQnaValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateLoadQnaConfiguration = validateLoadQnaConfiguration;
	function validateQnaInterpretInputData(input) {
	    var errors = exports.Validators.qnaInterpretInputDataValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateQnaInterpretInputData = validateQnaInterpretInputData;
	function validateExportDataRequest(input) {
	    var errors = exports.Validators.exportDataRequestValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateExportDataRequest = validateExportDataRequest;
	function validateVisualHeader(input) {
	    var errors = exports.Validators.visualHeaderValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateVisualHeader = validateVisualHeader;
	function validateVisualSettings(input) {
	    var errors = exports.Validators.visualSettingsValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateVisualSettings = validateVisualSettings;
	function validateCommandsSettings(input) {
	    var errors = exports.Validators.commandsSettingsValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateCommandsSettings = validateCommandsSettings;
	function validateCustomTheme(input) {
	    var errors = exports.Validators.customThemeValidator.validate(input);
	    return errors ? errors.map(normalizeError) : undefined;
	}
	exports.validateCustomTheme = validateCustomTheme;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", { value: true });
	var typeValidator_1 = __webpack_require__(2);
	var extensionsValidator_1 = __webpack_require__(3);
	var settingsValidator_1 = __webpack_require__(5);
	var bookmarkValidator_1 = __webpack_require__(6);
	var filtersValidator_1 = __webpack_require__(7);
	var fieldRequiredValidator_1 = __webpack_require__(8);
	var anyOfValidator_1 = __webpack_require__(9);
	var reportLoadValidator_1 = __webpack_require__(10);
	var reportCreateValidator_1 = __webpack_require__(11);
	var dashboardLoadValidator_1 = __webpack_require__(12);
	var tileLoadValidator_1 = __webpack_require__(13);
	var pageValidator_1 = __webpack_require__(14);
	var qnaValidator_1 = __webpack_require__(15);
	var saveAsParametersValidator_1 = __webpack_require__(16);
	var mapValidator_1 = __webpack_require__(17);
	var layoutValidator_1 = __webpack_require__(18);
	var exportDataValidator_1 = __webpack_require__(19);
	var selectorsValidator_1 = __webpack_require__(20);
	var slicersValidator_1 = __webpack_require__(21);
	var visualSettingsValidator_1 = __webpack_require__(22);
	var commandsSettingsValidator_1 = __webpack_require__(23);
	var customThemeValidator_1 = __webpack_require__(24);
	exports.Validators = {
	    addBookmarkRequestValidator: new bookmarkValidator_1.AddBookmarkRequestValidator(),
	    advancedFilterTypeValidator: new typeValidator_1.EnumValidator([0]),
	    advancedFilterValidator: new filtersValidator_1.AdvancedFilterValidator(),
	    anyArrayValidator: new typeValidator_1.ArrayValidator([new anyOfValidator_1.AnyOfValidator([new typeValidator_1.StringValidator(), new typeValidator_1.NumberValidator(), new typeValidator_1.BooleanValidator()])]),
	    anyFilterValidator: new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.BasicFilterValidator(), new filtersValidator_1.AdvancedFilterValidator(), new filtersValidator_1.IncludeExcludeFilterValidator(), new filtersValidator_1.NotSupportedFilterValidator(), new filtersValidator_1.RelativeDateFilterValidator(), new filtersValidator_1.TopNFilterValidator()]),
	    anyValueValidator: new anyOfValidator_1.AnyOfValidator([new typeValidator_1.StringValidator(), new typeValidator_1.NumberValidator(), new typeValidator_1.BooleanValidator()]),
	    applyBookmarkByNameRequestValidator: new bookmarkValidator_1.ApplyBookmarkByNameRequestValidator(),
	    applyBookmarkStateRequestValidator: new bookmarkValidator_1.ApplyBookmarkStateRequestValidator(),
	    applyBookmarkValidator: new anyOfValidator_1.AnyOfValidator([new bookmarkValidator_1.ApplyBookmarkByNameRequestValidator(), new bookmarkValidator_1.ApplyBookmarkStateRequestValidator()]),
	    backgroundValidator: new typeValidator_1.EnumValidator([0, 1]),
	    basicFilterTypeValidator: new typeValidator_1.EnumValidator([1]),
	    basicFilterValidator: new filtersValidator_1.BasicFilterValidator(),
	    booleanArrayValidator: new typeValidator_1.BooleanArrayValidator(),
	    booleanValidator: new typeValidator_1.BooleanValidator(),
	    commandDisplayOptionValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
	    commandExtensionSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.VisualTypeSelectorValidator()]),
	    commandExtensionValidator: new extensionsValidator_1.CommandExtensionValidator(),
	    commandsSettingsArrayValidator: new typeValidator_1.ArrayValidator([new commandsSettingsValidator_1.CommandsSettingsValidator()]),
	    commandsSettingsValidator: new commandsSettingsValidator_1.CommandsSettingsValidator(),
	    conditionItemValidator: new filtersValidator_1.ConditionItemValidator(),
	    customLayoutDisplayOptionValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
	    customLayoutValidator: new layoutValidator_1.CustomLayoutValidator(),
	    customPageSizeValidator: new pageValidator_1.CustomPageSizeValidator(),
	    customThemeValidator: new customThemeValidator_1.CustomThemeValidator(),
	    dashboardLoadValidator: new dashboardLoadValidator_1.DashboardLoadValidator(),
	    displayStateModeValidator: new typeValidator_1.EnumValidator([0, 1]),
	    displayStateValidator: new layoutValidator_1.DisplayStateValidator(),
	    exportDataRequestValidator: new exportDataValidator_1.ExportDataRequestValidator(),
	    extensionArrayValidator: new typeValidator_1.ArrayValidator([new extensionsValidator_1.ExtensionValidator()]),
	    extensionPointsValidator: new extensionsValidator_1.ExtensionPointsValidator(),
	    extensionValidator: new extensionsValidator_1.ExtensionValidator(),
	    fieldRequiredValidator: new fieldRequiredValidator_1.FieldRequiredValidator(),
	    filterColumnTargetValidator: new filtersValidator_1.FilterColumnTargetValidator(),
	    filterConditionsValidator: new typeValidator_1.ArrayValidator([new filtersValidator_1.ConditionItemValidator()]),
	    filterHierarchyTargetValidator: new filtersValidator_1.FilterHierarchyTargetValidator(),
	    filterMeasureTargetValidator: new filtersValidator_1.FilterMeasureTargetValidator(),
	    filterTargetValidator: new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.FilterColumnTargetValidator(), new filtersValidator_1.FilterHierarchyTargetValidator(), new filtersValidator_1.FilterMeasureTargetValidator()]),
	    filtersArrayValidator: new typeValidator_1.ArrayValidator([new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.BasicFilterValidator(), new filtersValidator_1.AdvancedFilterValidator(), new filtersValidator_1.RelativeDateFilterValidator()])]),
	    filtersValidator: new filtersValidator_1.FilterValidator(),
	    includeExcludeFilterValidator: new filtersValidator_1.IncludeExcludeFilterValidator(),
	    includeExludeFilterTypeValidator: new typeValidator_1.EnumValidator([3]),
	    layoutTypeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3]),
	    loadQnaValidator: new qnaValidator_1.LoadQnaValidator(),
	    menuExtensionValidator: new extensionsValidator_1.MenuExtensionValidator(),
	    menuLocationValidator: new typeValidator_1.EnumValidator([0, 1]),
	    notSupportedFilterTypeValidator: new typeValidator_1.EnumValidator([2]),
	    notSupportedFilterValidator: new filtersValidator_1.NotSupportedFilterValidator(),
	    numberArrayValidator: new typeValidator_1.NumberArrayValidator(),
	    numberValidator: new typeValidator_1.NumberValidator(),
	    pageLayoutValidator: new mapValidator_1.MapValidator([new typeValidator_1.StringValidator()], [new layoutValidator_1.VisualLayoutValidator()]),
	    pageSizeTypeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3, 4, 5]),
	    pageSizeValidator: new pageValidator_1.PageSizeValidator(),
	    pageValidator: new pageValidator_1.PageValidator(),
	    pageViewFieldValidator: new pageValidator_1.PageViewFieldValidator(),
	    pagesLayoutValidator: new mapValidator_1.MapValidator([new typeValidator_1.StringValidator()], [new layoutValidator_1.PageLayoutValidator()]),
	    permissionsValidator: new typeValidator_1.EnumValidator([0, 1, 2, 4, 7]),
	    playBookmarkRequestValidator: new bookmarkValidator_1.PlayBookmarkRequestValidator(),
	    qnaInterpretInputDataValidator: new qnaValidator_1.QnaInterpretInputDataValidator(),
	    qnaSettingValidator: new qnaValidator_1.QnaSettingsValidator(),
	    relativeDateFilterOperatorValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
	    relativeDateFilterTimeUnitTypeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3, 4, 5, 6]),
	    relativeDateFilterTypeValidator: new typeValidator_1.EnumValidator([4]),
	    relativeDateFilterValidator: new filtersValidator_1.RelativeDateFilterValidator(),
	    reportCreateValidator: new reportCreateValidator_1.ReportCreateValidator(),
	    reportLoadValidator: new reportLoadValidator_1.ReportLoadValidator(),
	    saveAsParametersValidator: new saveAsParametersValidator_1.SaveAsParametersValidator(),
	    settingsValidator: new settingsValidator_1.SettingsValidator(),
	    singleCommandSettingsValidator: new commandsSettingsValidator_1.SingleCommandSettingsValidator(),
	    slicerSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.SlicerTargetSelectorValidator()]),
	    slicerStateValidator: new slicersValidator_1.SlicerStateValidator(),
	    slicerTargetValidator: new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.FilterColumnTargetValidator(), new filtersValidator_1.FilterHierarchyTargetValidator(), new filtersValidator_1.FilterMeasureTargetValidator(), new filtersValidator_1.FilterKeyColumnsTargetValidator(), new filtersValidator_1.FilterKeyHierarchyTargetValidator()]),
	    slicerValidator: new slicersValidator_1.SlicerValidator(),
	    stringArrayValidator: new typeValidator_1.StringArrayValidator(),
	    stringValidator: new typeValidator_1.StringValidator(),
	    tileLoadValidator: new tileLoadValidator_1.TileLoadValidator(),
	    tokenTypeValidator: new typeValidator_1.EnumValidator([0, 1]),
	    topNFilterTypeValidator: new typeValidator_1.EnumValidator([5]),
	    topNFilterValidator: new filtersValidator_1.TopNFilterValidator(),
	    viewModeValidator: new typeValidator_1.EnumValidator([0, 1]),
	    visualCommandSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.VisualTypeSelectorValidator()]),
	    visualHeaderSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.VisualTypeSelectorValidator()]),
	    visualHeaderSettingsValidator: new visualSettingsValidator_1.VisualHeaderSettingsValidator(),
	    visualHeaderValidator: new visualSettingsValidator_1.VisualHeaderValidator(),
	    visualHeadersValidator: new typeValidator_1.ArrayValidator([new visualSettingsValidator_1.VisualHeaderValidator()]),
	    visualLayoutValidator: new layoutValidator_1.VisualLayoutValidator(),
	    visualSelectorValidator: new selectorsValidator_1.VisualSelectorValidator(),
	    visualSettingsValidator: new visualSettingsValidator_1.VisualSettingsValidator(),
	    visualTypeSelectorValidator: new selectorsValidator_1.VisualTypeSelectorValidator(),
	};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var ObjectValidator = /** @class */ (function () {
	    function ObjectValidator() {
	    }
	    ObjectValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        if (typeof input !== "object" || Array.isArray(input)) {
	            return [{
	                    message: field !== undefined ? field + " must be an object" : "input must be an object",
	                    path: path,
	                    keyword: "type"
	                }];
	        }
	        return null;
	    };
	    return ObjectValidator;
	}());
	exports.ObjectValidator = ObjectValidator;
	var ArrayValidator = /** @class */ (function () {
	    function ArrayValidator(itemValidators) {
	        this.itemValidators = itemValidators;
	    }
	    ArrayValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        if (!(Array.isArray(input))) {
	            return [{
	                    message: field + " property is invalid",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "type"
	                }];
	        }
	        for (var i = 0; i < input.length; i++) {
	            var fieldsPath = (path ? path + "." : "") + field + "." + i;
	            for (var _i = 0, _a = this.itemValidators; _i < _a.length; _i++) {
	                var validator = _a[_i];
	                var errors = validator.validate(input[i], fieldsPath, field);
	                if (errors) {
	                    return [{
	                            message: field + " property is invalid",
	                            path: (path ? path + "." : "") + field,
	                            keyword: "type"
	                        }];
	                }
	            }
	        }
	        return null;
	    };
	    return ArrayValidator;
	}());
	exports.ArrayValidator = ArrayValidator;
	var TypeValidator = /** @class */ (function () {
	    function TypeValidator(expectedType) {
	        this.expectedType = expectedType;
	    }
	    TypeValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        if (!(typeof input === this.expectedType)) {
	            return [{
	                    message: field + " must be a " + this.expectedType,
	                    path: (path ? path + "." : "") + field,
	                    keyword: "type"
	                }];
	        }
	        return null;
	    };
	    return TypeValidator;
	}());
	exports.TypeValidator = TypeValidator;
	var StringValidator = /** @class */ (function (_super) {
	    __extends(StringValidator, _super);
	    function StringValidator() {
	        return _super.call(this, "string") || this;
	    }
	    return StringValidator;
	}(TypeValidator));
	exports.StringValidator = StringValidator;
	var BooleanValidator = /** @class */ (function (_super) {
	    __extends(BooleanValidator, _super);
	    function BooleanValidator() {
	        return _super.call(this, "boolean") || this;
	    }
	    return BooleanValidator;
	}(TypeValidator));
	exports.BooleanValidator = BooleanValidator;
	var NumberValidator = /** @class */ (function (_super) {
	    __extends(NumberValidator, _super);
	    function NumberValidator() {
	        return _super.call(this, "number") || this;
	    }
	    return NumberValidator;
	}(TypeValidator));
	exports.NumberValidator = NumberValidator;
	var ValueValidator = /** @class */ (function () {
	    function ValueValidator(possibleValues) {
	        this.possibleValues = possibleValues;
	    }
	    ValueValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        if (this.possibleValues.indexOf(input) < 0) {
	            return [{
	                    message: field + " property is invalid",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "invalid"
	                }];
	        }
	        return null;
	    };
	    return ValueValidator;
	}());
	exports.ValueValidator = ValueValidator;
	var SchemaValidator = /** @class */ (function (_super) {
	    __extends(SchemaValidator, _super);
	    function SchemaValidator(schemaValue) {
	        var _this = _super.call(this, [schemaValue]) || this;
	        _this.schemaValue = schemaValue;
	        return _this;
	    }
	    SchemaValidator.prototype.validate = function (input, path, field) {
	        return _super.prototype.validate.call(this, input, path, field);
	    };
	    return SchemaValidator;
	}(ValueValidator));
	exports.SchemaValidator = SchemaValidator;
	var EnumValidator = /** @class */ (function (_super) {
	    __extends(EnumValidator, _super);
	    function EnumValidator(possibleValues) {
	        var _this = _super.call(this) || this;
	        _this.possibleValues = possibleValues;
	        return _this;
	    }
	    EnumValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var valueValidator = new ValueValidator(this.possibleValues);
	        return valueValidator.validate(input, path, field);
	    };
	    return EnumValidator;
	}(NumberValidator));
	exports.EnumValidator = EnumValidator;
	var StringArrayValidator = /** @class */ (function (_super) {
	    __extends(StringArrayValidator, _super);
	    function StringArrayValidator() {
	        return _super.call(this, [new StringValidator()]) || this;
	    }
	    StringArrayValidator.prototype.validate = function (input, path, field) {
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return [{
	                    message: field + " must be an array of strings",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "type"
	                }];
	        }
	        return null;
	    };
	    return StringArrayValidator;
	}(ArrayValidator));
	exports.StringArrayValidator = StringArrayValidator;
	var BooleanArrayValidator = /** @class */ (function (_super) {
	    __extends(BooleanArrayValidator, _super);
	    function BooleanArrayValidator() {
	        return _super.call(this, [new BooleanValidator()]) || this;
	    }
	    BooleanArrayValidator.prototype.validate = function (input, path, field) {
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return [{
	                    message: field + " must be an array of booleans",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "type"
	                }];
	        }
	        return null;
	    };
	    return BooleanArrayValidator;
	}(ArrayValidator));
	exports.BooleanArrayValidator = BooleanArrayValidator;
	var NumberArrayValidator = /** @class */ (function (_super) {
	    __extends(NumberArrayValidator, _super);
	    function NumberArrayValidator() {
	        return _super.call(this, [new NumberValidator()]) || this;
	    }
	    NumberArrayValidator.prototype.validate = function (input, path, field) {
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return [{
	                    message: field + " must be an array of numbers",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "type"
	                }];
	        }
	        return null;
	    };
	    return NumberArrayValidator;
	}(ArrayValidator));
	exports.NumberArrayValidator = NumberArrayValidator;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var MenuExtensionValidator = /** @class */ (function (_super) {
	    __extends(MenuExtensionValidator, _super);
	    function MenuExtensionValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    MenuExtensionValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "title",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "icon",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "menuLocation",
	                validators: [validator_1.Validators.menuLocationValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return MenuExtensionValidator;
	}(typeValidator_1.ObjectValidator));
	exports.MenuExtensionValidator = MenuExtensionValidator;
	var ExtensionPointsValidator = /** @class */ (function (_super) {
	    __extends(ExtensionPointsValidator, _super);
	    function ExtensionPointsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ExtensionPointsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "visualContextMenu",
	                validators: [validator_1.Validators.menuExtensionValidator]
	            },
	            {
	                field: "visualOptionsMenu",
	                validators: [validator_1.Validators.menuExtensionValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ExtensionPointsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ExtensionPointsValidator = ExtensionPointsValidator;
	var ExtensionItemValidator = /** @class */ (function (_super) {
	    __extends(ExtensionItemValidator, _super);
	    function ExtensionItemValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ExtensionItemValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "name",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "extend",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.extensionPointsValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ExtensionItemValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ExtensionItemValidator = ExtensionItemValidator;
	var CommandExtensionValidator = /** @class */ (function (_super) {
	    __extends(CommandExtensionValidator, _super);
	    function CommandExtensionValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CommandExtensionValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "title",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "icon",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "selector",
	                validators: [validator_1.Validators.commandExtensionSelectorValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return CommandExtensionValidator;
	}(ExtensionItemValidator));
	exports.CommandExtensionValidator = CommandExtensionValidator;
	var ExtensionValidator = /** @class */ (function (_super) {
	    __extends(ExtensionValidator, _super);
	    function ExtensionValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ExtensionValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "command",
	                validators: [validator_1.Validators.commandExtensionValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ExtensionValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ExtensionValidator = ExtensionValidator;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	Object.defineProperty(exports, "__esModule", { value: true });
	var MultipleFieldsValidator = /** @class */ (function () {
	    function MultipleFieldsValidator(fieldValidatorsPairs) {
	        this.fieldValidatorsPairs = fieldValidatorsPairs;
	    }
	    MultipleFieldsValidator.prototype.validate = function (input, path, field) {
	        if (!this.fieldValidatorsPairs) {
	            return null;
	        }
	        var fieldsPath = path ? path + "." + field : field;
	        for (var _i = 0, _a = this.fieldValidatorsPairs; _i < _a.length; _i++) {
	            var fieldValidators = _a[_i];
	            for (var _b = 0, _c = fieldValidators.validators; _b < _c.length; _b++) {
	                var validator = _c[_b];
	                var errors = validator.validate(input[fieldValidators.field], fieldsPath, fieldValidators.field);
	                if (errors) {
	                    return errors;
	                }
	            }
	        }
	        return null;
	    };
	    return MultipleFieldsValidator;
	}());
	exports.MultipleFieldsValidator = MultipleFieldsValidator;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var SettingsValidator = /** @class */ (function (_super) {
	    __extends(SettingsValidator, _super);
	    function SettingsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    SettingsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "filterPaneEnabled",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "navContentPaneEnabled",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "bookmarksPaneEnabled",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "useCustomSaveAsDialog",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "extensions",
	                validators: [validator_1.Validators.extensionArrayValidator]
	            },
	            {
	                field: "layoutType",
	                validators: [validator_1.Validators.layoutTypeValidator]
	            },
	            {
	                field: "customLayout",
	                validators: [validator_1.Validators.customLayoutValidator]
	            },
	            {
	                field: "background",
	                validators: [validator_1.Validators.backgroundValidator]
	            },
	            {
	                field: "visualSettings",
	                validators: [validator_1.Validators.visualSettingsValidator]
	            },
	            {
	                field: "hideErrors",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "commands",
	                validators: [validator_1.Validators.commandsSettingsArrayValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return SettingsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.SettingsValidator = SettingsValidator;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var PlayBookmarkRequestValidator = /** @class */ (function (_super) {
	    __extends(PlayBookmarkRequestValidator, _super);
	    function PlayBookmarkRequestValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    PlayBookmarkRequestValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "playMode",
	                validators: [validator_1.Validators.fieldRequiredValidator, new typeValidator_1.EnumValidator([0, 1])]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return PlayBookmarkRequestValidator;
	}(typeValidator_1.ObjectValidator));
	exports.PlayBookmarkRequestValidator = PlayBookmarkRequestValidator;
	var AddBookmarkRequestValidator = /** @class */ (function (_super) {
	    __extends(AddBookmarkRequestValidator, _super);
	    function AddBookmarkRequestValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AddBookmarkRequestValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "state",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "displayName",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "apply",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return AddBookmarkRequestValidator;
	}(typeValidator_1.ObjectValidator));
	exports.AddBookmarkRequestValidator = AddBookmarkRequestValidator;
	var ApplyBookmarkByNameRequestValidator = /** @class */ (function (_super) {
	    __extends(ApplyBookmarkByNameRequestValidator, _super);
	    function ApplyBookmarkByNameRequestValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ApplyBookmarkByNameRequestValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "name",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ApplyBookmarkByNameRequestValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ApplyBookmarkByNameRequestValidator = ApplyBookmarkByNameRequestValidator;
	var ApplyBookmarkStateRequestValidator = /** @class */ (function (_super) {
	    __extends(ApplyBookmarkStateRequestValidator, _super);
	    function ApplyBookmarkStateRequestValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ApplyBookmarkStateRequestValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "state",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ApplyBookmarkStateRequestValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ApplyBookmarkStateRequestValidator = ApplyBookmarkStateRequestValidator;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var FilterColumnTargetValidator = /** @class */ (function (_super) {
	    __extends(FilterColumnTargetValidator, _super);
	    function FilterColumnTargetValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FilterColumnTargetValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "table",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "column",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return FilterColumnTargetValidator;
	}(typeValidator_1.ObjectValidator));
	exports.FilterColumnTargetValidator = FilterColumnTargetValidator;
	var FilterKeyColumnsTargetValidator = /** @class */ (function (_super) {
	    __extends(FilterKeyColumnsTargetValidator, _super);
	    function FilterKeyColumnsTargetValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FilterKeyColumnsTargetValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "keys",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringArrayValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return FilterKeyColumnsTargetValidator;
	}(FilterColumnTargetValidator));
	exports.FilterKeyColumnsTargetValidator = FilterKeyColumnsTargetValidator;
	var FilterHierarchyTargetValidator = /** @class */ (function (_super) {
	    __extends(FilterHierarchyTargetValidator, _super);
	    function FilterHierarchyTargetValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FilterHierarchyTargetValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "table",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "hierarchy",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "hierarchyLevel",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return FilterHierarchyTargetValidator;
	}(typeValidator_1.ObjectValidator));
	exports.FilterHierarchyTargetValidator = FilterHierarchyTargetValidator;
	var FilterKeyHierarchyTargetValidator = /** @class */ (function (_super) {
	    __extends(FilterKeyHierarchyTargetValidator, _super);
	    function FilterKeyHierarchyTargetValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FilterKeyHierarchyTargetValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "keys",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringArrayValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return FilterKeyHierarchyTargetValidator;
	}(FilterHierarchyTargetValidator));
	exports.FilterKeyHierarchyTargetValidator = FilterKeyHierarchyTargetValidator;
	var FilterMeasureTargetValidator = /** @class */ (function (_super) {
	    __extends(FilterMeasureTargetValidator, _super);
	    function FilterMeasureTargetValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FilterMeasureTargetValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "table",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "measure",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return FilterMeasureTargetValidator;
	}(typeValidator_1.ObjectValidator));
	exports.FilterMeasureTargetValidator = FilterMeasureTargetValidator;
	var BasicFilterValidator = /** @class */ (function (_super) {
	    __extends(BasicFilterValidator, _super);
	    function BasicFilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    BasicFilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "target",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
	            },
	            {
	                field: "operator",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "values",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.anyArrayValidator]
	            },
	            {
	                field: "filterType",
	                validators: [validator_1.Validators.basicFilterTypeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return BasicFilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.BasicFilterValidator = BasicFilterValidator;
	var AdvancedFilterValidator = /** @class */ (function (_super) {
	    __extends(AdvancedFilterValidator, _super);
	    function AdvancedFilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AdvancedFilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "target",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
	            },
	            {
	                field: "logicalOperator",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "conditions",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterConditionsValidator]
	            },
	            {
	                field: "filterType",
	                validators: [validator_1.Validators.advancedFilterTypeValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return AdvancedFilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.AdvancedFilterValidator = AdvancedFilterValidator;
	var RelativeDateFilterValidator = /** @class */ (function (_super) {
	    __extends(RelativeDateFilterValidator, _super);
	    function RelativeDateFilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    RelativeDateFilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "target",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
	            },
	            {
	                field: "operator",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.relativeDateFilterOperatorValidator]
	            },
	            {
	                field: "timeUnitsCount",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.numberValidator]
	            },
	            {
	                field: "timeUnitType",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.relativeDateFilterTimeUnitTypeValidator]
	            },
	            {
	                field: "includeToday",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "filterType",
	                validators: [validator_1.Validators.relativeDateFilterTypeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return RelativeDateFilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.RelativeDateFilterValidator = RelativeDateFilterValidator;
	var TopNFilterValidator = /** @class */ (function (_super) {
	    __extends(TopNFilterValidator, _super);
	    function TopNFilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    TopNFilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "target",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
	            },
	            {
	                field: "operator",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "itemCount",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.numberValidator]
	            },
	            {
	                field: "filterType",
	                validators: [validator_1.Validators.topNFilterTypeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return TopNFilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.TopNFilterValidator = TopNFilterValidator;
	var NotSupportedFilterValidator = /** @class */ (function (_super) {
	    __extends(NotSupportedFilterValidator, _super);
	    function NotSupportedFilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    NotSupportedFilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "target",
	                validators: [validator_1.Validators.filterTargetValidator]
	            },
	            {
	                field: "message",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "notSupportedTypeName",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "filterType",
	                validators: [validator_1.Validators.notSupportedFilterTypeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return NotSupportedFilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.NotSupportedFilterValidator = NotSupportedFilterValidator;
	var IncludeExcludeFilterValidator = /** @class */ (function (_super) {
	    __extends(IncludeExcludeFilterValidator, _super);
	    function IncludeExcludeFilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    IncludeExcludeFilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "target",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
	            },
	            {
	                field: "isExclude",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "values",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.anyArrayValidator]
	            },
	            {
	                field: "filterType",
	                validators: [validator_1.Validators.includeExludeFilterTypeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return IncludeExcludeFilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.IncludeExcludeFilterValidator = IncludeExcludeFilterValidator;
	var FilterValidator = /** @class */ (function (_super) {
	    __extends(FilterValidator, _super);
	    function FilterValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    FilterValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        return validator_1.Validators.anyFilterValidator.validate(input, path, field);
	    };
	    return FilterValidator;
	}(typeValidator_1.ObjectValidator));
	exports.FilterValidator = FilterValidator;
	var ConditionItemValidator = /** @class */ (function (_super) {
	    __extends(ConditionItemValidator, _super);
	    function ConditionItemValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ConditionItemValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "value",
	                validators: [validator_1.Validators.anyValueValidator]
	            },
	            {
	                field: "operator",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ConditionItemValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ConditionItemValidator = ConditionItemValidator;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	Object.defineProperty(exports, "__esModule", { value: true });
	var FieldRequiredValidator = /** @class */ (function () {
	    function FieldRequiredValidator() {
	    }
	    FieldRequiredValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return [{
	                    message: field + " is required",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "required"
	                }];
	        }
	        return null;
	    };
	    return FieldRequiredValidator;
	}());
	exports.FieldRequiredValidator = FieldRequiredValidator;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	Object.defineProperty(exports, "__esModule", { value: true });
	var AnyOfValidator = /** @class */ (function () {
	    function AnyOfValidator(validators) {
	        this.validators = validators;
	    }
	    AnyOfValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var valid = false;
	        for (var _i = 0, _a = this.validators; _i < _a.length; _i++) {
	            var validator = _a[_i];
	            var errors = validator.validate(input, path, field);
	            if (!errors) {
	                valid = true;
	                break;
	            }
	        }
	        if (!valid) {
	            return [{
	                    message: field + " property is invalid",
	                    path: (path ? path + "." : "") + field,
	                    keyword: "invalid"
	                }];
	        }
	        return null;
	    };
	    return AnyOfValidator;
	}());
	exports.AnyOfValidator = AnyOfValidator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var ReportLoadValidator = /** @class */ (function (_super) {
	    __extends(ReportLoadValidator, _super);
	    function ReportLoadValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ReportLoadValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "accessToken",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "id",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "groupId",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "settings",
	                validators: [validator_1.Validators.settingsValidator]
	            },
	            {
	                field: "pageName",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "filters",
	                validators: [validator_1.Validators.filtersArrayValidator]
	            },
	            {
	                field: "permissions",
	                validators: [validator_1.Validators.permissionsValidator]
	            },
	            {
	                field: "viewMode",
	                validators: [validator_1.Validators.viewModeValidator]
	            },
	            {
	                field: "tokenType",
	                validators: [validator_1.Validators.tokenTypeValidator]
	            },
	            {
	                field: "bookmark",
	                validators: [validator_1.Validators.applyBookmarkValidator]
	            },
	            {
	                field: "theme",
	                validators: [validator_1.Validators.customThemeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ReportLoadValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ReportLoadValidator = ReportLoadValidator;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var ReportCreateValidator = /** @class */ (function (_super) {
	    __extends(ReportCreateValidator, _super);
	    function ReportCreateValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ReportCreateValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "accessToken",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "datasetId",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "groupId",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "tokenType",
	                validators: [validator_1.Validators.tokenTypeValidator]
	            },
	            {
	                field: "theme",
	                validators: [validator_1.Validators.customThemeValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ReportCreateValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ReportCreateValidator = ReportCreateValidator;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var DashboardLoadValidator = /** @class */ (function (_super) {
	    __extends(DashboardLoadValidator, _super);
	    function DashboardLoadValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    DashboardLoadValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "accessToken",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "id",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "groupId",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "pageView",
	                validators: [validator_1.Validators.pageViewFieldValidator]
	            },
	            {
	                field: "tokenType",
	                validators: [validator_1.Validators.tokenTypeValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return DashboardLoadValidator;
	}(typeValidator_1.ObjectValidator));
	exports.DashboardLoadValidator = DashboardLoadValidator;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var TileLoadValidator = /** @class */ (function (_super) {
	    __extends(TileLoadValidator, _super);
	    function TileLoadValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    TileLoadValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "accessToken",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "id",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "dashboardId",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "groupId",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "pageView",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "tokenType",
	                validators: [validator_1.Validators.tokenTypeValidator]
	            },
	            {
	                field: "width",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "height",
	                validators: [validator_1.Validators.numberValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return TileLoadValidator;
	}(typeValidator_1.ObjectValidator));
	exports.TileLoadValidator = TileLoadValidator;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var PageSizeValidator = /** @class */ (function (_super) {
	    __extends(PageSizeValidator, _super);
	    function PageSizeValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    PageSizeValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "type",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.pageSizeTypeValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return PageSizeValidator;
	}(typeValidator_1.ObjectValidator));
	exports.PageSizeValidator = PageSizeValidator;
	var CustomPageSizeValidator = /** @class */ (function (_super) {
	    __extends(CustomPageSizeValidator, _super);
	    function CustomPageSizeValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CustomPageSizeValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "width",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "height",
	                validators: [validator_1.Validators.numberValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return CustomPageSizeValidator;
	}(PageSizeValidator));
	exports.CustomPageSizeValidator = CustomPageSizeValidator;
	var PageValidator = /** @class */ (function (_super) {
	    __extends(PageValidator, _super);
	    function PageValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    PageValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "name",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return PageValidator;
	}(typeValidator_1.ObjectValidator));
	exports.PageValidator = PageValidator;
	var PageViewFieldValidator = /** @class */ (function (_super) {
	    __extends(PageViewFieldValidator, _super);
	    function PageViewFieldValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    PageViewFieldValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var possibleValues = ["actualSize", "fitToWidth", "oneColumn"];
	        if (possibleValues.indexOf(input) < 0) {
	            return [{
	                    message: "pageView must be a string with one of the following values: \"actualSize\", \"fitToWidth\", \"oneColumn\""
	                }];
	        }
	        return null;
	    };
	    return PageViewFieldValidator;
	}(typeValidator_1.StringValidator));
	exports.PageViewFieldValidator = PageViewFieldValidator;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var LoadQnaValidator = /** @class */ (function (_super) {
	    __extends(LoadQnaValidator, _super);
	    function LoadQnaValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    LoadQnaValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "accessToken",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	            {
	                field: "datasetIds",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringArrayValidator]
	            },
	            {
	                field: "question",
	                validators: [validator_1.Validators.stringValidator]
	            },
	            {
	                field: "viewMode",
	                validators: [validator_1.Validators.viewModeValidator]
	            },
	            {
	                field: "settings",
	                validators: [validator_1.Validators.qnaSettingValidator]
	            },
	            {
	                field: "tokenType",
	                validators: [validator_1.Validators.tokenTypeValidator]
	            },
	            {
	                field: "groupId",
	                validators: [validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return LoadQnaValidator;
	}(typeValidator_1.ObjectValidator));
	exports.LoadQnaValidator = LoadQnaValidator;
	var QnaSettingsValidator = /** @class */ (function (_super) {
	    __extends(QnaSettingsValidator, _super);
	    function QnaSettingsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    QnaSettingsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "filterPaneEnabled",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	            {
	                field: "hideErrors",
	                validators: [validator_1.Validators.booleanValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return QnaSettingsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.QnaSettingsValidator = QnaSettingsValidator;
	var QnaInterpretInputDataValidator = /** @class */ (function (_super) {
	    __extends(QnaInterpretInputDataValidator, _super);
	    function QnaInterpretInputDataValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    QnaInterpretInputDataValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "datasetIds",
	                validators: [validator_1.Validators.stringArrayValidator]
	            },
	            {
	                field: "question",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return QnaInterpretInputDataValidator;
	}(typeValidator_1.ObjectValidator));
	exports.QnaInterpretInputDataValidator = QnaInterpretInputDataValidator;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var SaveAsParametersValidator = /** @class */ (function (_super) {
	    __extends(SaveAsParametersValidator, _super);
	    function SaveAsParametersValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    SaveAsParametersValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "name",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return SaveAsParametersValidator;
	}(typeValidator_1.ObjectValidator));
	exports.SaveAsParametersValidator = SaveAsParametersValidator;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var typeValidator_1 = __webpack_require__(2);
	var MapValidator = /** @class */ (function (_super) {
	    __extends(MapValidator, _super);
	    function MapValidator(keyValidators, valueValidators) {
	        var _this = _super.call(this) || this;
	        _this.keyValidators = keyValidators;
	        _this.valueValidators = valueValidators;
	        return _this;
	    }
	    MapValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        for (var key in input) {
	            if (input.hasOwnProperty(key)) {
	                var fieldsPath = (path ? path + "." : "") + field + "." + key;
	                for (var _i = 0, _a = this.keyValidators; _i < _a.length; _i++) {
	                    var keyValidator = _a[_i];
	                    errors = keyValidator.validate(key, fieldsPath, field);
	                    if (errors) {
	                        return errors;
	                    }
	                }
	                for (var _b = 0, _c = this.valueValidators; _b < _c.length; _b++) {
	                    var valueValidator = _c[_b];
	                    errors = valueValidator.validate(input[key], fieldsPath, field);
	                    if (errors) {
	                        return errors;
	                    }
	                }
	            }
	        }
	        return null;
	    };
	    return MapValidator;
	}(typeValidator_1.ObjectValidator));
	exports.MapValidator = MapValidator;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var CustomLayoutValidator = /** @class */ (function (_super) {
	    __extends(CustomLayoutValidator, _super);
	    function CustomLayoutValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CustomLayoutValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "pageSize",
	                validators: [validator_1.Validators.pageSizeValidator]
	            },
	            {
	                field: "displayOption",
	                validators: [validator_1.Validators.customLayoutDisplayOptionValidator]
	            },
	            {
	                field: "pagesLayout",
	                validators: [validator_1.Validators.pagesLayoutValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return CustomLayoutValidator;
	}(typeValidator_1.ObjectValidator));
	exports.CustomLayoutValidator = CustomLayoutValidator;
	var VisualLayoutValidator = /** @class */ (function (_super) {
	    __extends(VisualLayoutValidator, _super);
	    function VisualLayoutValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    VisualLayoutValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "x",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "y",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "z",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "width",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "height",
	                validators: [validator_1.Validators.numberValidator]
	            },
	            {
	                field: "displayState",
	                validators: [validator_1.Validators.displayStateValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return VisualLayoutValidator;
	}(typeValidator_1.ObjectValidator));
	exports.VisualLayoutValidator = VisualLayoutValidator;
	var DisplayStateValidator = /** @class */ (function (_super) {
	    __extends(DisplayStateValidator, _super);
	    function DisplayStateValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    DisplayStateValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "mode",
	                validators: [validator_1.Validators.displayStateModeValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return DisplayStateValidator;
	}(typeValidator_1.ObjectValidator));
	exports.DisplayStateValidator = DisplayStateValidator;
	var PageLayoutValidator = /** @class */ (function (_super) {
	    __extends(PageLayoutValidator, _super);
	    function PageLayoutValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    PageLayoutValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "visualsLayout",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.pageLayoutValidator]
	            },
	            {
	                field: "defaultLayout",
	                validators: [validator_1.Validators.visualLayoutValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return PageLayoutValidator;
	}(typeValidator_1.ObjectValidator));
	exports.PageLayoutValidator = PageLayoutValidator;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var ExportDataRequestValidator = /** @class */ (function (_super) {
	    __extends(ExportDataRequestValidator, _super);
	    function ExportDataRequestValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ExportDataRequestValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "rows",
	                validators: [new typeValidator_1.NumberValidator()]
	            },
	            {
	                field: "exportDataType",
	                validators: [new typeValidator_1.EnumValidator([0, 1])]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return ExportDataRequestValidator;
	}(typeValidator_1.ObjectValidator));
	exports.ExportDataRequestValidator = ExportDataRequestValidator;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var typeValidator_2 = __webpack_require__(2);
	var VisualSelectorValidator = /** @class */ (function (_super) {
	    __extends(VisualSelectorValidator, _super);
	    function VisualSelectorValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    VisualSelectorValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                // Not required for this selector only - Backward compatibility 
	                field: "$schema",
	                validators: [validator_1.Validators.stringValidator, new typeValidator_2.SchemaValidator("http://powerbi.com/product/schema#visualSelector")]
	            },
	            {
	                field: "visualName",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return VisualSelectorValidator;
	}(typeValidator_1.ObjectValidator));
	exports.VisualSelectorValidator = VisualSelectorValidator;
	var VisualTypeSelectorValidator = /** @class */ (function (_super) {
	    __extends(VisualTypeSelectorValidator, _super);
	    function VisualTypeSelectorValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    VisualTypeSelectorValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "$schema",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator, new typeValidator_2.SchemaValidator("http://powerbi.com/product/schema#visualTypeSelector")]
	            },
	            {
	                field: "visualType",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return VisualTypeSelectorValidator;
	}(typeValidator_1.ObjectValidator));
	exports.VisualTypeSelectorValidator = VisualTypeSelectorValidator;
	var SlicerTargetSelectorValidator = /** @class */ (function (_super) {
	    __extends(SlicerTargetSelectorValidator, _super);
	    function SlicerTargetSelectorValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    SlicerTargetSelectorValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "$schema",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator, new typeValidator_2.SchemaValidator("http://powerbi.com/product/schema#slicerTargetSelector")]
	            },
	            {
	                field: "target",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.slicerTargetValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return SlicerTargetSelectorValidator;
	}(typeValidator_1.ObjectValidator));
	exports.SlicerTargetSelectorValidator = SlicerTargetSelectorValidator;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var SlicerValidator = /** @class */ (function (_super) {
	    __extends(SlicerValidator, _super);
	    function SlicerValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    SlicerValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "selector",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.slicerSelectorValidator]
	            },
	            {
	                field: "state",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.slicerStateValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return SlicerValidator;
	}(typeValidator_1.ObjectValidator));
	exports.SlicerValidator = SlicerValidator;
	var SlicerStateValidator = /** @class */ (function (_super) {
	    __extends(SlicerStateValidator, _super);
	    function SlicerStateValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    SlicerStateValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "filters",
	                validators: [validator_1.Validators.filtersArrayValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return SlicerStateValidator;
	}(typeValidator_1.ObjectValidator));
	exports.SlicerStateValidator = SlicerStateValidator;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var VisualSettingsValidator = /** @class */ (function (_super) {
	    __extends(VisualSettingsValidator, _super);
	    function VisualSettingsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    VisualSettingsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "visualHeaders",
	                validators: [validator_1.Validators.visualHeadersValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return VisualSettingsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.VisualSettingsValidator = VisualSettingsValidator;
	var VisualHeaderSettingsValidator = /** @class */ (function (_super) {
	    __extends(VisualHeaderSettingsValidator, _super);
	    function VisualHeaderSettingsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    VisualHeaderSettingsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "visible",
	                validators: [validator_1.Validators.booleanValidator]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return VisualHeaderSettingsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.VisualHeaderSettingsValidator = VisualHeaderSettingsValidator;
	var VisualHeaderValidator = /** @class */ (function (_super) {
	    __extends(VisualHeaderValidator, _super);
	    function VisualHeaderValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    VisualHeaderValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "settings",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.visualHeaderSettingsValidator]
	            },
	            {
	                field: "selector",
	                validators: [validator_1.Validators.visualHeaderSelectorValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return VisualHeaderValidator;
	}(typeValidator_1.ObjectValidator));
	exports.VisualHeaderValidator = VisualHeaderValidator;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var validator_1 = __webpack_require__(1);
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var CommandsSettingsValidator = /** @class */ (function (_super) {
	    __extends(CommandsSettingsValidator, _super);
	    function CommandsSettingsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CommandsSettingsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "copy",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "drill",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "drillthrough",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "expandCollapse",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "exportData",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "includeExclude",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "removeVisual",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "search",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "seeData",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "sort",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	            {
	                field: "spotlight",
	                validators: [validator_1.Validators.singleCommandSettingsValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return CommandsSettingsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.CommandsSettingsValidator = CommandsSettingsValidator;
	var SingleCommandSettingsValidator = /** @class */ (function (_super) {
	    __extends(SingleCommandSettingsValidator, _super);
	    function SingleCommandSettingsValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    SingleCommandSettingsValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "displayOption",
	                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.commandDisplayOptionValidator]
	            },
	            {
	                field: "selector",
	                validators: [validator_1.Validators.visualCommandSelectorValidator]
	            },
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return SingleCommandSettingsValidator;
	}(typeValidator_1.ObjectValidator));
	exports.SingleCommandSettingsValidator = SingleCommandSettingsValidator;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var multipleFieldsValidator_1 = __webpack_require__(4);
	var typeValidator_1 = __webpack_require__(2);
	var CustomThemeValidator = /** @class */ (function (_super) {
	    __extends(CustomThemeValidator, _super);
	    function CustomThemeValidator() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    CustomThemeValidator.prototype.validate = function (input, path, field) {
	        if (input == null) {
	            return null;
	        }
	        var errors = _super.prototype.validate.call(this, input, path, field);
	        if (errors) {
	            return errors;
	        }
	        var fields = [
	            {
	                field: "themeJson",
	                validators: [new typeValidator_1.ObjectValidator()]
	            }
	        ];
	        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
	        return multipleFieldsValidator.validate(input, path, field);
	    };
	    return CustomThemeValidator;
	}(typeValidator_1.ObjectValidator));
	exports.CustomThemeValidator = CustomThemeValidator;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=models.js.map
/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});

var jQuery = typeof jQuery !== "undefined" ? jQuery : window["$"];

/*!
 * Select2 4.0.6-rc.1
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
(function(factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node/CommonJS
    module.exports = function(root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== "undefined") {
          jQuery = require("jquery");
        } else {
          jQuery = require("jquery")(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function(jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 = (function() {
    // Restore the Select2 AMD loader so it can be used
    // Needed mostly in the language files, where the loader is not inserted
    if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
      var S2 = jQuery.fn.select2.amd;
    }
    var S2;
    (function() {
      if (!S2 || !S2.requirejs) {
        if (!S2) {
          S2 = {};
        } else {
          require = S2;
        }
        /**
         * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
         * Released under MIT license, http://github.com/requirejs/almond/LICENSE
         */
        //Going sloppy to avoid 'use strict' string cost, but strict practices should
        //be followed.
        /*global setTimeout: false */

        var requirejs, require, define;
        (function(undef) {
          var main,
            req,
            makeMap,
            handlers,
            defined = {},
            waiting = {},
            config = {},
            defining = {},
            hasOwn = Object.prototype.hasOwnProperty,
            aps = [].slice,
            jsSuffixRegExp = /\.js$/;

          function hasProp(obj, prop) {
            return hasOwn.call(obj, prop);
          }

          /**
           * Given a relative module name, like ./something, normalize it to
           * a real name that can be mapped to a path.
           * @param {String} name the relative name
           * @param {String} baseName a real name that the name arg is relative
           * to.
           * @returns {String} normalized name
           */
          function normalize(name, baseName) {
            var nameParts,
              nameSegment,
              mapValue,
              foundMap,
              lastIndex,
              foundI,
              foundStarMap,
              starI,
              i,
              j,
              part,
              normalizedBaseParts,
              baseParts = baseName && baseName.split("/"),
              map = config.map,
              starMap = (map && map["*"]) || {};

            //Adjust any relative paths.
            if (name) {
              name = name.split("/");
              lastIndex = name.length - 1;

              // If wanting node ID compatibility, strip .js from end
              // of IDs. Have to do this here, and not in nameToUrl
              // because node allows either .js or non .js to map
              // to same file.
              if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, "");
              }

              // Starts with a '.' so need the baseName
              if (name[0].charAt(0) === "." && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
              }

              //start trimDots
              for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === ".") {
                  name.splice(i, 1);
                  i -= 1;
                } else if (part === "..") {
                  // If at the start, or previous value is still ..,
                  // keep them so that when converted to a path it may
                  // still work when converted to a path, even though
                  // as an ID it is less than ideal. In larger point
                  // releases, may be better to just kick out an error.
                  if (
                    i === 0 ||
                    (i === 1 && name[2] === "..") ||
                    name[i - 1] === ".."
                  ) {
                    continue;
                  } else if (i > 0) {
                    name.splice(i - 1, 2);
                    i -= 2;
                  }
                }
              }
              //end trimDots

              name = name.join("/");
            }

            //Apply map config if available.
            if ((baseParts || starMap) && map) {
              nameParts = name.split("/");

              for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                  //Find the longest baseName segment match in the config.
                  //So, do joins on the biggest to smallest lengths of baseParts.
                  for (j = baseParts.length; j > 0; j -= 1) {
                    mapValue = map[baseParts.slice(0, j).join("/")];

                    //baseName segment has  config, find if it has one for
                    //this name.
                    if (mapValue) {
                      mapValue = mapValue[nameSegment];
                      if (mapValue) {
                        //Match, update name to the new value.
                        foundMap = mapValue;
                        foundI = i;
                        break;
                      }
                    }
                  }
                }

                if (foundMap) {
                  break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                  foundStarMap = starMap[nameSegment];
                  starI = i;
                }
              }

              if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
              }

              if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join("/");
              }
            }

            return name;
          }

          function makeRequire(relName, forceSync) {
            return function() {
              //A version of a require function that passes a moduleName
              //value for items that may need to
              //look up paths relative to the moduleName
              var args = aps.call(arguments, 0);

              //If first arg is not require('string'), and there is only
              //one arg, it is the array form without a callback. Insert
              //a null so that the following concat is correct.
              if (typeof args[0] !== "string" && args.length === 1) {
                args.push(null);
              }
              return req.apply(undef, args.concat([relName, forceSync]));
            };
          }

          function makeNormalize(relName) {
            return function(name) {
              return normalize(name, relName);
            };
          }

          function makeLoad(depName) {
            return function(value) {
              defined[depName] = value;
            };
          }

          function callDep(name) {
            if (hasProp(waiting, name)) {
              var args = waiting[name];
              delete waiting[name];
              defining[name] = true;
              main.apply(undef, args);
            }

            if (!hasProp(defined, name) && !hasProp(defining, name)) {
              throw new Error("No " + name);
            }
            return defined[name];
          }

          //Turns a plugin!resource to [plugin, resource]
          //with the plugin being undefined if the name
          //did not have a plugin prefix.
          function splitPrefix(name) {
            var prefix,
              index = name ? name.indexOf("!") : -1;
            if (index > -1) {
              prefix = name.substring(0, index);
              name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
          }

          //Creates a parts array for a relName where first part is plugin ID,
          //second part is resource ID. Assumes relName has already been normalized.
          function makeRelParts(relName) {
            return relName ? splitPrefix(relName) : [];
          }

          /**
           * Makes a name map, normalizing the name, and using a plugin
           * for normalization if necessary. Grabs a ref to plugin
           * too, as an optimization.
           */
          makeMap = function(name, relParts) {
            var plugin,
              parts = splitPrefix(name),
              prefix = parts[0],
              relResourceName = relParts[1];

            name = parts[1];

            if (prefix) {
              prefix = normalize(prefix, relResourceName);
              plugin = callDep(prefix);
            }

            //Normalize according
            if (prefix) {
              if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
              } else {
                name = normalize(name, relResourceName);
              }
            } else {
              name = normalize(name, relResourceName);
              parts = splitPrefix(name);
              prefix = parts[0];
              name = parts[1];
              if (prefix) {
                plugin = callDep(prefix);
              }
            }

            //Using ridiculous property names for space reasons
            return {
              f: prefix ? prefix + "!" + name : name, //fullName
              n: name,
              pr: prefix,
              p: plugin
            };
          };

          function makeConfig(name) {
            return function() {
              return (config && config.config && config.config[name]) || {};
            };
          }

          handlers = {
            require: function(name) {
              return makeRequire(name);
            },
            exports: function(name) {
              var e = defined[name];
              if (typeof e !== "undefined") {
                return e;
              } else {
                return (defined[name] = {});
              }
            },
            module: function(name) {
              return {
                id: name,
                uri: "",
                exports: defined[name],
                config: makeConfig(name)
              };
            }
          };

          main = function(name, deps, callback, relName) {
            var cjsModule,
              depName,
              ret,
              map,
              i,
              relParts,
              args = [],
              callbackType = typeof callback,
              usingExports;

            //Use name if no relName
            relName = relName || name;
            relParts = makeRelParts(relName);

            //Call the callback to define the module, if necessary.
            if (callbackType === "undefined" || callbackType === "function") {
              //Pull out the defined dependencies and pass the ordered
              //values to the callback.
              //Default to [require, exports, module] if no deps
              deps =
                !deps.length && callback.length
                  ? ["require", "exports", "module"]
                  : deps;
              for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                  args[i] = handlers.require(name);
                } else if (depName === "exports") {
                  //CommonJS module spec 1.1
                  args[i] = handlers.exports(name);
                  usingExports = true;
                } else if (depName === "module") {
                  //CommonJS module spec 1.1
                  cjsModule = args[i] = handlers.module(name);
                } else if (
                  hasProp(defined, depName) ||
                  hasProp(waiting, depName) ||
                  hasProp(defining, depName)
                ) {
                  args[i] = callDep(depName);
                } else if (map.p) {
                  map.p.load(
                    map.n,
                    makeRequire(relName, true),
                    makeLoad(depName),
                    {}
                  );
                  args[i] = defined[depName];
                } else {
                  throw new Error(name + " missing " + depName);
                }
              }

              ret = callback ? callback.apply(defined[name], args) : undefined;

              if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (
                  cjsModule &&
                  cjsModule.exports !== undef &&
                  cjsModule.exports !== defined[name]
                ) {
                  defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                  //Use the return value from the function.
                  defined[name] = ret;
                }
              }
            } else if (name) {
              //May just be an object definition for the module. Only
              //worry about defining if have a module name.
              defined[name] = callback;
            }
          };

          requirejs = require = req = function(
            deps,
            callback,
            relName,
            forceSync,
            alt
          ) {
            if (typeof deps === "string") {
              if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
              }
              //Just return the module wanted. In this scenario, the
              //deps arg is the module name, and second arg (if passed)
              //is just the relName.
              //Normalize module name, if it contains . or ..
              return callDep(makeMap(deps, makeRelParts(callback)).f);
            } else if (!deps.splice) {
              //deps is a config object, not an array.
              config = deps;
              if (config.deps) {
                req(config.deps, config.callback);
              }
              if (!callback) {
                return;
              }

              if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
              } else {
                deps = undef;
              }
            }

            //Support require(['a'])
            callback = callback || function() {};

            //If relName is a function, it is an errback handler,
            //so remove it.
            if (typeof relName === "function") {
              relName = forceSync;
              forceSync = alt;
            }

            //Simulate async callback;
            if (forceSync) {
              main(undef, deps, callback, relName);
            } else {
              //Using a non-zero value because of concern for what old browsers
              //do, and latest browsers "upgrade" to 4 if lower value is used:
              //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
              //If want a value immediately, use require('id') instead -- something
              //that works in almond on the global level, but not guaranteed and
              //unlikely to work in other AMD implementations.
              setTimeout(function() {
                main(undef, deps, callback, relName);
              }, 4);
            }

            return req;
          };

          /**
           * Just drops the config on the floor, but returns req in case
           * the config return value is used.
           */
          req.config = function(cfg) {
            return req(cfg);
          };

          /**
           * Expose module registry for debugging and tooling
           */
          requirejs._defined = defined;

          define = function(name, deps, callback) {
            if (typeof name !== "string") {
              throw new Error(
                "See almond README: incorrect module build, no module name"
              );
            }

            //This module may not have dependencies
            if (!deps.splice) {
              //deps is not an array, so probably means
              //an object literal or factory function for
              //the value. Adjust args.
              callback = deps;
              deps = [];
            }

            if (!hasProp(defined, name) && !hasProp(waiting, name)) {
              waiting[name] = [name, deps, callback];
            }
          };

          define.amd = {
            jQuery: true
          };
        })();

        S2.requirejs = requirejs;
        S2.require = require;
        S2.define = define;
      }
    })();
    S2.define("almond", function() {});

    /* global jQuery:false, $:false */
    S2.define("jquery", [], function() {
      var _$ = jQuery || $;

      if (_$ == null && console && console.error) {
        console.error(
          "Select2: An instance of jQuery or a jQuery-compatible library was not " +
            "found. Make sure that you are including jQuery before Select2 on your " +
            "web page."
        );
      }

      return _$;
    });

    S2.define("select2/utils", ["jquery"], function($) {
      var Utils = {};

      Utils.Extend = function(ChildClass, SuperClass) {
        var __hasProp = {}.hasOwnProperty;

        function BaseConstructor() {
          this.constructor = ChildClass;
        }

        for (var key in SuperClass) {
          if (__hasProp.call(SuperClass, key)) {
            ChildClass[key] = SuperClass[key];
          }
        }

        BaseConstructor.prototype = SuperClass.prototype;
        ChildClass.prototype = new BaseConstructor();
        ChildClass.__super__ = SuperClass.prototype;

        return ChildClass;
      };

      function getMethods(theClass) {
        var proto = theClass.prototype;

        var methods = [];

        for (var methodName in proto) {
          var m = proto[methodName];

          if (typeof m !== "function") {
            continue;
          }

          if (methodName === "constructor") {
            continue;
          }

          methods.push(methodName);
        }

        return methods;
      }

      Utils.Decorate = function(SuperClass, DecoratorClass) {
        var decoratedMethods = getMethods(DecoratorClass);
        var superMethods = getMethods(SuperClass);

        function DecoratedClass() {
          var unshift = Array.prototype.unshift;

          var argCount = DecoratorClass.prototype.constructor.length;

          var calledConstructor = SuperClass.prototype.constructor;

          if (argCount > 0) {
            unshift.call(arguments, SuperClass.prototype.constructor);

            calledConstructor = DecoratorClass.prototype.constructor;
          }

          calledConstructor.apply(this, arguments);
        }

        DecoratorClass.displayName = SuperClass.displayName;

        function ctr() {
          this.constructor = DecoratedClass;
        }

        DecoratedClass.prototype = new ctr();

        for (var m = 0; m < superMethods.length; m++) {
          var superMethod = superMethods[m];

          DecoratedClass.prototype[superMethod] =
            SuperClass.prototype[superMethod];
        }

        var calledMethod = function(methodName) {
          // Stub out the original method if it's not decorating an actual method
          var originalMethod = function() {};

          if (methodName in DecoratedClass.prototype) {
            originalMethod = DecoratedClass.prototype[methodName];
          }

          var decoratedMethod = DecoratorClass.prototype[methodName];

          return function() {
            var unshift = Array.prototype.unshift;

            unshift.call(arguments, originalMethod);

            return decoratedMethod.apply(this, arguments);
          };
        };

        for (var d = 0; d < decoratedMethods.length; d++) {
          var decoratedMethod = decoratedMethods[d];

          DecoratedClass.prototype[decoratedMethod] = calledMethod(
            decoratedMethod
          );
        }

        return DecoratedClass;
      };

      var Observable = function() {
        this.listeners = {};
      };

      Observable.prototype.on = function(event, callback) {
        this.listeners = this.listeners || {};

        if (event in this.listeners) {
          this.listeners[event].push(callback);
        } else {
          this.listeners[event] = [callback];
        }
      };

      Observable.prototype.trigger = function(event) {
        var slice = Array.prototype.slice;
        var params = slice.call(arguments, 1);

        this.listeners = this.listeners || {};

        // Params should always come in as an array
        if (params == null) {
          params = [];
        }

        // If there are no arguments to the event, use a temporary object
        if (params.length === 0) {
          params.push({});
        }

        // Set the `_type` of the first object to the event
        params[0]._type = event;

        if (event in this.listeners) {
          this.invoke(this.listeners[event], slice.call(arguments, 1));
        }

        if ("*" in this.listeners) {
          this.invoke(this.listeners["*"], arguments);
        }
      };

      Observable.prototype.invoke = function(listeners, params) {
        for (var i = 0, len = listeners.length; i < len; i++) {
          listeners[i].apply(this, params);
        }
      };

      Utils.Observable = Observable;

      Utils.generateChars = function(length) {
        var chars = "";

        for (var i = 0; i < length; i++) {
          var randomChar = Math.floor(Math.random() * 36);
          chars += randomChar.toString(36);
        }

        return chars;
      };

      Utils.bind = function(func, context) {
        return function() {
          func.apply(context, arguments);
        };
      };

      Utils._convertData = function(data) {
        for (var originalKey in data) {
          var keys = originalKey.split("-");

          var dataLevel = data;

          if (keys.length === 1) {
            continue;
          }

          for (var k = 0; k < keys.length; k++) {
            var key = keys[k];

            // Lowercase the first letter
            // By default, dash-separated becomes camelCase
            key = key.substring(0, 1).toLowerCase() + key.substring(1);

            if (!(key in dataLevel)) {
              dataLevel[key] = {};
            }

            if (k == keys.length - 1) {
              dataLevel[key] = data[originalKey];
            }

            dataLevel = dataLevel[key];
          }

          delete data[originalKey];
        }

        return data;
      };

      Utils.hasScroll = function(index, el) {
        // Adapted from the function created by @ShadowScripter
        // and adapted by @BillBarry on the Stack Exchange Code Review website.
        // The original code can be found at
        // http://codereview.stackexchange.com/q/13338
        // and was designed to be used with the Sizzle selector engine.

        var $el = $(el);
        var overflowX = el.style.overflowX;
        var overflowY = el.style.overflowY;

        //Check both x and y declarations
        if (
          overflowX === overflowY &&
          (overflowY === "hidden" || overflowY === "visible")
        ) {
          return false;
        }

        if (overflowX === "scroll" || overflowY === "scroll") {
          return true;
        }

        return (
          $el.innerHeight() < el.scrollHeight ||
          $el.innerWidth() < el.scrollWidth
        );
      };

      Utils.escapeMarkup = function(markup) {
        var replaceMap = {
          "\\": "&#92;",
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
          "/": "&#47;"
        };

        // Do not try to escape the markup if it's not a string
        if (typeof markup !== "string") {
          return markup;
        }

        return String(markup).replace(/[&<>"'\/\\]/g, function(match) {
          return replaceMap[match];
        });
      };

      // Append an array of jQuery nodes to a given element.
      Utils.appendMany = function($element, $nodes) {
        // jQuery 1.7.x does not support $.fn.append() with an array
        // Fall back to a jQuery object collection using $.fn.add()
        if ($.fn.jquery.substr(0, 3) === "1.7") {
          var $jqNodes = $();

          $.map($nodes, function(node) {
            $jqNodes = $jqNodes.add(node);
          });

          $nodes = $jqNodes;
        }

        $element.append($nodes);
      };

      // Cache objects in Utils.__cache instead of $.data (see #4346)
      Utils.__cache = {};

      var id = 0;
      Utils.GetUniqueElementId = function(element) {
        // Get a unique element Id. If element has no id,
        // creates a new unique number, stores it in the id
        // attribute and returns the new id.
        // If an id already exists, it simply returns it.

        var select2Id = element.getAttribute("data-select2-id");
        if (select2Id == null) {
          // If element has id, use it.
          if (element.id) {
            select2Id = element.id;
            element.setAttribute("data-select2-id", select2Id);
          } else {
            element.setAttribute("data-select2-id", ++id);
            select2Id = id.toString();
          }
        }
        return select2Id;
      };

      Utils.StoreData = function(element, name, value) {
        // Stores an item in the cache for a specified element.
        // name is the cache key.
        var id = Utils.GetUniqueElementId(element);
        if (!Utils.__cache[id]) {
          Utils.__cache[id] = {};
        }

        Utils.__cache[id][name] = value;
      };

      Utils.GetData = function(element, name) {
        // Retrieves a value from the cache by its key (name)
        // name is optional. If no name specified, return
        // all cache items for the specified element.
        // and for a specified element.
        var id = Utils.GetUniqueElementId(element);
        if (name) {
          if (Utils.__cache[id]) {
            return Utils.__cache[id][name] != null
              ? Utils.__cache[id][name]
              : $(element).data(name); // Fallback to HTML5 data attribs.
          }
          return $(element).data(name); // Fallback to HTML5 data attribs.
        } else {
          return Utils.__cache[id];
        }
      };

      Utils.RemoveData = function(element) {
        // Removes all cached items for a specified element.
        var id = Utils.GetUniqueElementId(element);
        if (Utils.__cache[id] != null) {
          delete Utils.__cache[id];
        }
      };

      return Utils;
    });

    S2.define("select2/results", ["jquery", "./utils"], function($, Utils) {
      function Results($element, options, dataAdapter) {
        this.$element = $element;
        this.data = dataAdapter;
        this.options = options;

        Results.__super__.constructor.call(this);
      }

      Utils.Extend(Results, Utils.Observable);

      Results.prototype.render = function() {
        var $results = $(
          '<ul class="select2-results__options" role="tree"></ul>'
        );

        if (this.options.get("multiple")) {
          $results.attr("aria-multiselectable", "true");
        }

        this.$results = $results;

        return $results;
      };

      Results.prototype.clear = function() {
        this.$results.empty();
      };

      Results.prototype.displayMessage = function(params) {
        var escapeMarkup = this.options.get("escapeMarkup");

        this.clear();
        this.hideLoading();

        var $message = $(
          '<li role="treeitem" aria-live="assertive"' +
            ' class="select2-results__option"></li>'
        );

        var message = this.options.get("translations").get(params.message);

        $message.append(escapeMarkup(message(params.args)));

        $message[0].className += " select2-results__message";

        this.$results.append($message);
      };

      Results.prototype.hideMessages = function() {
        this.$results.find(".select2-results__message").remove();
      };

      Results.prototype.append = function(data) {
        this.hideLoading();

        var $options = [];

        if (data.results == null || data.results.length === 0) {
          if (this.$results.children().length === 0) {
            this.trigger("results:message", {
              message: "noResults"
            });
          }

          return;
        }

        data.results = this.sort(data.results);

        for (var d = 0; d < data.results.length; d++) {
          var item = data.results[d];

          var $option = this.option(item);

          $options.push($option);
        }

        this.$results.append($options);
      };

      Results.prototype.position = function($results, $dropdown) {
        var $resultsContainer = $dropdown.find(".select2-results");
        $resultsContainer.append($results);
      };

      Results.prototype.sort = function(data) {
        var sorter = this.options.get("sorter");

        return sorter(data);
      };

      Results.prototype.highlightFirstItem = function() {
        var $options = this.$results.find(
          ".select2-results__option[aria-selected]"
        );

        var $selected = $options.filter("[aria-selected=true]");

        // Check if there are any selected options
        if ($selected.length > 0) {
          // If there are selected options, highlight the first
          $selected.first().trigger("mouseenter");
        } else {
          // If there are no selected options, highlight the first option
          // in the dropdown
          $options.first().trigger("mouseenter");
        }

        this.ensureHighlightVisible();
      };

      Results.prototype.setClasses = function() {
        var self = this;

        this.data.current(function(selected) {
          var selectedIds = $.map(selected, function(s) {
            return s.id.toString();
          });

          var $options = self.$results.find(
            ".select2-results__option[aria-selected]"
          );

          $options.each(function() {
            var $option = $(this);

            var item = Utils.GetData(this, "data");

            // id needs to be converted to a string when comparing
            var id = "" + item.id;

            if (
              (item.element != null && item.element.selected) ||
              (item.element == null && $.inArray(id, selectedIds) > -1)
            ) {
              $option.attr("aria-selected", "true");
              $option.css("background", "#660066");
              $option.css("color", "#ffffff");
            } else {
              $option.attr("aria-selected", "false");
              $option.css("background", "");
              $option.css("color", "#000000");
            }
          });
        });
      };

      Results.prototype.showLoading = function(params) {
        this.hideLoading();

        var loadingMore = this.options.get("translations").get("searching");

        var loading = {
          disabled: true,
          loading: true,
          text: loadingMore(params)
        };
        var $loading = this.option(loading);
        $loading.className += " loading-results";

        this.$results.prepend($loading);
      };

      Results.prototype.hideLoading = function() {
        this.$results.find(".loading-results").remove();
      };

      Results.prototype.option = function(data) {
        var option = document.createElement("li");
        option.className = "select2-results__option";

        var attrs = {
          role: "treeitem",
          "aria-selected": "false"
        };

        if (data.disabled) {
          delete attrs["aria-selected"];
          attrs["aria-disabled"] = "true";
        }

        if (data.id == null) {
          delete attrs["aria-selected"];
        }

        if (data._resultId != null) {
          option.id = data._resultId;
        }

        if (data.title) {
          option.title = data.title;
        }

        if (data.children) {
          attrs.role = "group";
          attrs["aria-label"] = data.text;
          delete attrs["aria-selected"];
        }

        for (var attr in attrs) {
          var val = attrs[attr];

          option.setAttribute(attr, val);
        }

        if (data.children) {
          var $option = $(option);

          var label = document.createElement("strong");
          label.className = "select2-results__group";

          var $label = $(label);
          this.template(data, label);

          var $children = [];

          for (var c = 0; c < data.children.length; c++) {
            var child = data.children[c];

            var $child = this.option(child);

            $children.push($child);
          }

          var $childrenContainer = $("<ul></ul>", {
            class: "select2-results__options select2-results__options--nested"
          });

          $childrenContainer.append($children);

          $option.append(label);
          $option.append($childrenContainer);
        } else {
          this.template(data, option);
        }

        Utils.StoreData(option, "data", data);

        return option;
      };

      Results.prototype.bind = function(container, $container) {
        var self = this;

        var id = container.id + "-results";

        this.$results.attr("id", id);

        container.on("results:all", function(params) {
          self.clear();
          self.append(params.data);

          if (container.isOpen()) {
            self.setClasses();
            self.highlightFirstItem();
          }
        });

        container.on("results:append", function(params) {
          self.append(params.data);

          if (container.isOpen()) {
            self.setClasses();
          }
        });

        container.on("query", function(params) {
          self.hideMessages();
          self.showLoading(params);
        });

        container.on("select", function() {
          if (!container.isOpen()) {
            return;
          }

          self.setClasses();
          self.highlightFirstItem();
        });

        container.on("unselect", function() {
          if (!container.isOpen()) {
            return;
          }

          self.setClasses();
          self.highlightFirstItem();
        });

        container.on("open", function() {
          // When the dropdown is open, aria-expended="true"
          self.$results.attr("aria-expanded", "true");
          self.$results.attr("aria-hidden", "false");

          self.setClasses();
          self.ensureHighlightVisible();
        });

        container.on("close", function() {
          // When the dropdown is closed, aria-expended="false"
          self.$results.attr("aria-expanded", "false");
          self.$results.attr("aria-hidden", "true");
          self.$results.removeAttr("aria-activedescendant");
        });

        container.on("results:toggle", function() {
          var $highlighted = self.getHighlightedResults();

          if ($highlighted.length === 0) {
            return;
          }

          $highlighted.trigger("mouseup");
        });

        container.on("results:select", function() {
          var $highlighted = self.getHighlightedResults();

          if ($highlighted.length === 0) {
            return;
          }

          var data = Utils.GetData($highlighted[0], "data");

          if ($highlighted.attr("aria-selected") == "true") {
            self.trigger("close", {});
          } else {
            self.trigger("select", {
              data: data
            });
          }
        });

        container.on("results:previous", function() {
          var $highlighted = self.getHighlightedResults();

          var $options = self.$results.find("[aria-selected]");

          var currentIndex = $options.index($highlighted);

          // If we are already at te top, don't move further
          // If no options, currentIndex will be -1
          if (currentIndex <= 0) {
            return;
          }

          var nextIndex = currentIndex - 1;

          // If none are highlighted, highlight the first
          if ($highlighted.length === 0) {
            nextIndex = 0;
          }

          var $next = $options.eq(nextIndex);

          $next.trigger("mouseenter");

          var currentOffset = self.$results.offset().top;
          var nextTop = $next.offset().top;
          var nextOffset =
            self.$results.scrollTop() + (nextTop - currentOffset);

          if (nextIndex === 0) {
            self.$results.scrollTop(0);
          } else if (nextTop - currentOffset < 0) {
            self.$results.scrollTop(nextOffset);
          }
        });

        container.on("results:next", function() {
          var $highlighted = self.getHighlightedResults();

          var $options = self.$results.find("[aria-selected]");

          var currentIndex = $options.index($highlighted);

          var nextIndex = currentIndex + 1;

          // If we are at the last option, stay there
          if (nextIndex >= $options.length) {
            return;
          }

          var $next = $options.eq(nextIndex);

          $next.trigger("mouseenter");

          var currentOffset =
            self.$results.offset().top + self.$results.outerHeight(false);
          var nextBottom = $next.offset().top + $next.outerHeight(false);
          var nextOffset =
            self.$results.scrollTop() + nextBottom - currentOffset;

          if (nextIndex === 0) {
            self.$results.scrollTop(0);
          } else if (nextBottom > currentOffset) {
            self.$results.scrollTop(nextOffset);
          }
        });

        container.on("results:focus", function(params) {
          params.element.addClass("select2-results__option--highlighted");
          // params.element.css("background", "chartreuse");
        });

        container.on("results:message", function(params) {
          self.displayMessage(params);
        });

        if ($.fn.mousewheel) {
          this.$results.on("mousewheel", function(e) {
            var top = self.$results.scrollTop();

            var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

            var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
            var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

            if (isAtTop) {
              self.$results.scrollTop(0);

              e.preventDefault();
              e.stopPropagation();
            } else if (isAtBottom) {
              self.$results.scrollTop(
                self.$results.get(0).scrollHeight - self.$results.height()
              );

              e.preventDefault();
              e.stopPropagation();
            }
          });
        }

        this.$results.on(
          "mouseup",
          ".select2-results__option[aria-selected]",
          function(evt) {
            var $this = $(this);

            var data = Utils.GetData(this, "data");

            if ($this.attr("aria-selected") === "true") {
              if (self.options.get("multiple")) {
                self.trigger("unselect", {
                  originalEvent: evt,
                  data: data
                });
              } else {
                self.trigger("close", {});
              }

              return;
            }

            self.trigger("select", {
              originalEvent: evt,
              data: data
            });
          }
        );

        this.$results.on(
          "mouseenter",
          ".select2-results__option[aria-selected]",
          function(evt) {
            var data = Utils.GetData(this, "data");

            self
              .getHighlightedResults()
              .removeClass("select2-results__option--highlighted");
            // .css("background-color", "");
            self.trigger("results:focus", {
              data: data,
              element: $(this)
            });
          }
        );
      };

      Results.prototype.getHighlightedResults = function() {
        var $highlighted = this.$results.find(
          ".select2-results__option--highlighted"
        );

        return $highlighted;
      };

      Results.prototype.destroy = function() {
        this.$results.remove();
      };

      Results.prototype.ensureHighlightVisible = function() {
        var $highlighted = this.getHighlightedResults();

        if ($highlighted.length === 0) {
          return;
        }

        var $options = this.$results.find("[aria-selected]");

        var currentIndex = $options.index($highlighted);

        var currentOffset = this.$results.offset().top;
        var nextTop = $highlighted.offset().top;
        var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

        var offsetDelta = nextTop - currentOffset;
        nextOffset -= $highlighted.outerHeight(false) * 2;

        if (currentIndex <= 2) {
          this.$results.scrollTop(0);
        } else if (
          offsetDelta > this.$results.outerHeight() ||
          offsetDelta < 0
        ) {
          this.$results.scrollTop(nextOffset);
        }
      };

      Results.prototype.template = function(result, container) {
        var template = this.options.get("templateResult");
        var escapeMarkup = this.options.get("escapeMarkup");

        var content = template(result, container);

        if (content == null) {
          container.style.display = "none";
        } else if (typeof content === "string") {
          container.innerHTML = escapeMarkup(content);
        } else {
          $(container).append(content);
        }
      };

      return Results;
    });

    S2.define("select2/keys", [], function() {
      var KEYS = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46
      };

      return KEYS;
    });

    S2.define(
      "select2/selection/base",
      ["jquery", "../utils", "../keys"],
      function($, Utils, KEYS) {
        function BaseSelection($element, options) {
          this.$element = $element;
          this.options = options;

          BaseSelection.__super__.constructor.call(this);
        }

        Utils.Extend(BaseSelection, Utils.Observable);

        BaseSelection.prototype.render = function() {
          var $selection = $(
            '<span class="select2-selection" role="combobox" ' +
              ' aria-haspopup="true" aria-expanded="false">' +
              "</span>"
          );

          this._tabindex = 0;

          if (Utils.GetData(this.$element[0], "old-tabindex") != null) {
            this._tabindex = Utils.GetData(this.$element[0], "old-tabindex");
          } else if (this.$element.attr("tabindex") != null) {
            this._tabindex = this.$element.attr("tabindex");
          }

          $selection.attr("title", this.$element.attr("title"));
          $selection.attr("tabindex", this._tabindex);

          this.$selection = $selection;

          return $selection;
        };

        BaseSelection.prototype.bind = function(container, $container) {
          var self = this;

          var id = container.id + "-container";
          var resultsId = container.id + "-results";

          this.container = container;

          this.$selection.on("focus", function(evt) {
            self.trigger("focus", evt);
          });

          this.$selection.on("blur", function(evt) {
            self._handleBlur(evt);
          });

          this.$selection.on("keydown", function(evt) {
            self.trigger("keypress", evt);

            if (evt.which === KEYS.SPACE) {
              evt.preventDefault();
            }
          });

          container.on("results:focus", function(params) {
            self.$selection.attr(
              "aria-activedescendant",
              params.data._resultId
            );
          });

          container.on("selection:update", function(params) {
            self.update(params.data);
          });

          container.on("open", function() {
            // When the dropdown is open, aria-expanded="true"
            self.$selection.attr("aria-expanded", "true");
            self.$selection.attr("aria-owns", resultsId);

            self._attachCloseHandler(container);
          });

          container.on("close", function() {
            // When the dropdown is closed, aria-expanded="false"
            self.$selection.attr("aria-expanded", "false");
            self.$selection.removeAttr("aria-activedescendant");
            self.$selection.removeAttr("aria-owns");

            self.$selection.focus();
            window.setTimeout(function() {
              self.$selection.focus();
            }, 0);

            self._detachCloseHandler(container);
          });

          container.on("enable", function() {
            self.$selection.attr("tabindex", self._tabindex);
          });

          container.on("disable", function() {
            self.$selection.attr("tabindex", "-1");
          });
        };

        BaseSelection.prototype._handleBlur = function(evt) {
          var self = this;

          // This needs to be delayed as the active element is the body when the tab
          // key is pressed, possibly along with others.
          window.setTimeout(function() {
            // Don't trigger `blur` if the focus is still in the selection
            if (
              document.activeElement == self.$selection[0] ||
              $.contains(self.$selection[0], document.activeElement)
            ) {
              return;
            }

            self.trigger("blur", evt);
          }, 1);
        };

        BaseSelection.prototype._attachCloseHandler = function(container) {
          var self = this;

          $(document.body).on("mousedown.select2." + container.id, function(e) {
            var $target = $(e.target);

            var $select = $target.closest(".select2");

            var $all = $(".select2.select2-container--open");

            $all.each(function() {
              var $this = $(this);

              if (this == $select[0]) {
                return;
              }

              var $element = Utils.GetData(this, "element");

              $element.select2("close");
            });
          });
        };

        BaseSelection.prototype._detachCloseHandler = function(container) {
          $(document.body).off("mousedown.select2." + container.id);
        };

        BaseSelection.prototype.position = function($selection, $container) {
          var $selectionContainer = $container.find(".selection");
          $selectionContainer.append($selection);
        };

        BaseSelection.prototype.destroy = function() {
          this._detachCloseHandler(this.container);
        };

        BaseSelection.prototype.update = function(data) {
          throw new Error(
            "The `update` method must be defined in child classes."
          );
        };

        return BaseSelection;
      }
    );

    S2.define(
      "select2/selection/single",
      ["jquery", "./base", "../utils", "../keys"],
      function($, BaseSelection, Utils, KEYS) {
        function SingleSelection() {
          SingleSelection.__super__.constructor.apply(this, arguments);
        }

        Utils.Extend(SingleSelection, BaseSelection);

        SingleSelection.prototype.render = function() {
          var $selection = SingleSelection.__super__.render.call(this);

          $selection.addClass("select2-selection--single");

          $selection.html(
            '<span class="select2-selection__rendered"></span>' +
              '<span class="select2-selection__arrow" role="presentation">' +
              '<b role="presentation"></b>' +
              "</span>"
          );

          return $selection;
        };

        SingleSelection.prototype.bind = function(container, $container) {
          var self = this;

          SingleSelection.__super__.bind.apply(this, arguments);

          var id = container.id + "-container";

          this.$selection
            .find(".select2-selection__rendered")
            .attr("id", id)
            .attr("role", "textbox")
            .attr("aria-readonly", "true");
          this.$selection.attr("aria-labelledby", id);

          this.$selection.on("mousedown", function(evt) {
            // Only respond to left clicks
            if (evt.which !== 1) {
              return;
            }

            self.trigger("toggle", {
              originalEvent: evt
            });
          });

          this.$selection.on("focus", function(evt) {
            // User focuses on the container
          });

          this.$selection.on("blur", function(evt) {
            // User exits the container
          });

          container.on("focus", function(evt) {
            if (!container.isOpen()) {
              self.$selection.focus();
            }
          });
        };

        SingleSelection.prototype.clear = function() {
          var $rendered = this.$selection.find(".select2-selection__rendered");
          $rendered.empty();
          $rendered.removeAttr("title"); // clear tooltip on empty
        };

        SingleSelection.prototype.display = function(data, container) {
          var template = this.options.get("templateSelection");
          var escapeMarkup = this.options.get("escapeMarkup");

          return escapeMarkup(template(data, container));
        };

        SingleSelection.prototype.selectionContainer = function() {
          return $("<span></span>");
        };

        SingleSelection.prototype.update = function(data) {
          if (data.length === 0) {
            this.clear();
            return;
          }

          var selection = data[0];

          var $rendered = this.$selection.find(".select2-selection__rendered");
          var formatted = this.display(selection, $rendered);

          $rendered.empty().append(formatted);
          $rendered.attr("title", selection.title || selection.text);
        };

        return SingleSelection;
      }
    );

    S2.define(
      "select2/selection/multiple",
      ["jquery", "./base", "../utils"],
      function($, BaseSelection, Utils) {
        function MultipleSelection($element, options) {
          MultipleSelection.__super__.constructor.apply(this, arguments);
        }

        Utils.Extend(MultipleSelection, BaseSelection);

        MultipleSelection.prototype.render = function() {
          var $selection = MultipleSelection.__super__.render.call(this);

          $selection.addClass("select2-selection--multiple");

          $selection.html('<ul class="select2-selection__rendered"></ul>');

          return $selection;
        };

        MultipleSelection.prototype.bind = function(container, $container) {
          var self = this;

          MultipleSelection.__super__.bind.apply(this, arguments);

          this.$selection.on("click", function(evt) {
            self.trigger("toggle", {
              originalEvent: evt
            });
          });

          this.$selection.on(
            "click",
            ".select2-selection__choice__remove",
            function(evt) {
              // Ignore the event if it is disabled
              if (self.options.get("disabled")) {
                return;
              }

              var $remove = $(this);
              var $selection = $remove.parent();

              var data = Utils.GetData($selection[0], "data");

              self.trigger("unselect", {
                originalEvent: evt,
                data: data
              });
            }
          );
        };

        MultipleSelection.prototype.clear = function() {
          var $rendered = this.$selection.find(".select2-selection__rendered");
          $rendered.empty();
          $rendered.removeAttr("title");
        };

        MultipleSelection.prototype.display = function(data, container) {
          var template = this.options.get("templateSelection");
          var escapeMarkup = this.options.get("escapeMarkup");

          return escapeMarkup(template(data, container));
        };

        MultipleSelection.prototype.selectionContainer = function() {
          var $container = $(
            '<li class="select2-selection__choice">' +
              '<span class="select2-selection__choice__remove" role="presentation">' +
              "&times;" +
              "</span>" +
              "</li>"
          );

          return $container;
        };

        MultipleSelection.prototype.update = function(data) {
          this.clear();

          if (data.length === 0) {
            return;
          }

          var $selections = [];

          for (var d = 0; d < data.length; d++) {
            var selection = data[d];

            var $selection = this.selectionContainer();
            var formatted = this.display(selection, $selection);

            $selection.append(formatted);
            $selection.attr("title", selection.title || selection.text);

            Utils.StoreData($selection[0], "data", selection);

            $selections.push($selection);
          }

          var $rendered = this.$selection.find(".select2-selection__rendered");

          Utils.appendMany($rendered, $selections);
        };

        return MultipleSelection;
      }
    );

    S2.define("select2/selection/placeholder", ["../utils"], function(Utils) {
      function Placeholder(decorated, $element, options) {
        this.placeholder = this.normalizePlaceholder(
          options.get("placeholder")
        );

        decorated.call(this, $element, options);
      }

      Placeholder.prototype.normalizePlaceholder = function(_, placeholder) {
        if (typeof placeholder === "string") {
          placeholder = {
            id: "",
            text: placeholder
          };
        }

        return placeholder;
      };

      Placeholder.prototype.createPlaceholder = function(
        decorated,
        placeholder
      ) {
        var $placeholder = this.selectionContainer();

        $placeholder.html(this.display(placeholder));
        $placeholder
          .addClass("select2-selection__placeholder")
          .removeClass("select2-selection__choice");

        return $placeholder;
      };

      Placeholder.prototype.update = function(decorated, data) {
        var singlePlaceholder =
          data.length == 1 && data[0].id != this.placeholder.id;
        var multipleSelections = data.length > 1;

        if (multipleSelections || singlePlaceholder) {
          return decorated.call(this, data);
        }

        this.clear();

        var $placeholder = this.createPlaceholder(this.placeholder);

        this.$selection
          .find(".select2-selection__rendered")
          .append($placeholder);
      };

      return Placeholder;
    });

    S2.define(
      "select2/selection/allowClear",
      ["jquery", "../keys", "../utils"],
      function($, KEYS, Utils) {
        function AllowClear() {}

        AllowClear.prototype.bind = function(decorated, container, $container) {
          var self = this;

          decorated.call(this, container, $container);

          if (this.placeholder == null) {
            if (this.options.get("debug") && window.console && console.error) {
              console.error(
                "Select2: The `allowClear` option should be used in combination " +
                  "with the `placeholder` option."
              );
            }
          }

          this.$selection.on("mousedown", ".select2-selection__clear", function(
            evt
          ) {
            self._handleClear(evt);
          });

          container.on("keypress", function(evt) {
            self._handleKeyboardClear(evt, container);
          });
        };

        AllowClear.prototype._handleClear = function(_, evt) {
          // Ignore the event if it is disabled
          if (this.options.get("disabled")) {
            return;
          }

          var $clear = this.$selection.find(".select2-selection__clear");

          // Ignore the event if nothing has been selected
          if ($clear.length === 0) {
            return;
          }

          evt.stopPropagation();

          var data = Utils.GetData($clear[0], "data");

          var previousVal = this.$element.val();
          this.$element.val(this.placeholder.id);

          var unselectData = {
            data: data
          };
          this.trigger("clear", unselectData);
          if (unselectData.prevented) {
            this.$element.val(previousVal);
            return;
          }

          for (var d = 0; d < data.length; d++) {
            unselectData = {
              data: data[d]
            };

            // Trigger the `unselect` event, so people can prevent it from being
            // cleared.
            this.trigger("unselect", unselectData);

            // If the event was prevented, don't clear it out.
            if (unselectData.prevented) {
              this.$element.val(previousVal);
              return;
            }
          }

          this.$element.trigger("change");

          this.trigger("toggle", {});
        };

        AllowClear.prototype._handleKeyboardClear = function(
          _,
          evt,
          container
        ) {
          if (container.isOpen()) {
            return;
          }

          if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
            this._handleClear(evt);
          }
        };

        AllowClear.prototype.update = function(decorated, data) {
          decorated.call(this, data);

          if (
            this.$selection.find(".select2-selection__placeholder").length >
              0 ||
            data.length === 0
          ) {
            return;
          }

          var $remove = $(
            '<span class="select2-selection__clear">' + "&times;" + "</span>"
          );
          Utils.StoreData($remove[0], "data", data);

          this.$selection.find(".select2-selection__rendered").prepend($remove);
        };

        return AllowClear;
      }
    );

    S2.define(
      "select2/selection/search",
      ["jquery", "../utils", "../keys"],
      function($, Utils, KEYS) {
        function Search(decorated, $element, options) {
          decorated.call(this, $element, options);
        }

        Search.prototype.render = function(decorated) {
          var $search = $(
            '<li class="select2-search select2-search--inline">' +
              '<input class="select2-search__field" type="search" tabindex="-1"' +
              ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
              ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
              "</li>"
          );

          this.$searchContainer = $search;
          this.$search = $search.find("input");

          var $rendered = decorated.call(this);

          this._transferTabIndex();

          return $rendered;
        };

        Search.prototype.bind = function(decorated, container, $container) {
          var self = this;

          decorated.call(this, container, $container);

          container.on("open", function() {
            self.$search.trigger("focus");
          });

          container.on("close", function() {
            self.$search.val("");
            self.$search.removeAttr("aria-activedescendant");
            self.$search.trigger("focus");
          });

          container.on("enable", function() {
            self.$search.prop("disabled", false);

            self._transferTabIndex();
          });

          container.on("disable", function() {
            self.$search.prop("disabled", true);
          });

          container.on("focus", function(evt) {
            self.$search.trigger("focus");
          });

          container.on("results:focus", function(params) {
            self.$search.attr("aria-activedescendant", params.id);
          });

          this.$selection.on("focusin", ".select2-search--inline", function(
            evt
          ) {
            self.trigger("focus", evt);
          });

          this.$selection.on("focusout", ".select2-search--inline", function(
            evt
          ) {
            self._handleBlur(evt);
          });

          this.$selection.on("keydown", ".select2-search--inline", function(
            evt
          ) {
            evt.stopPropagation();

            self.trigger("keypress", evt);

            self._keyUpPrevented = evt.isDefaultPrevented();

            var key = evt.which;

            if (key === KEYS.BACKSPACE && self.$search.val() === "") {
              var $previousChoice = self.$searchContainer.prev(
                ".select2-selection__choice"
              );

              if ($previousChoice.length > 0) {
                var item = Utils.GetData($previousChoice[0], "data");

                self.searchRemoveChoice(item);

                evt.preventDefault();
              }
            }
          });

          // Try to detect the IE version should the `documentMode` property that
          // is stored on the document. This is only implemented in IE and is
          // slightly cleaner than doing a user agent check.
          // This property is not available in Edge, but Edge also doesn't have
          // this bug.
          var msie = document.documentMode;
          var disableInputEvents = msie && msie <= 11;

          // Workaround for browsers which do not support the `input` event
          // This will prevent double-triggering of events for browsers which support
          // both the `keyup` and `input` events.
          this.$selection.on(
            "input.searchcheck",
            ".select2-search--inline",
            function(evt) {
              // IE will trigger the `input` event when a placeholder is used on a
              // search box. To get around this issue, we are forced to ignore all
              // `input` events in IE and keep using `keyup`.
              if (disableInputEvents) {
                self.$selection.off("input.search input.searchcheck");
                return;
              }

              // Unbind the duplicated `keyup` event
              self.$selection.off("keyup.search");
            }
          );

          this.$selection.on(
            "keyup.search input.search",
            ".select2-search--inline",
            function(evt) {
              // IE will trigger the `input` event when a placeholder is used on a
              // search box. To get around this issue, we are forced to ignore all
              // `input` events in IE and keep using `keyup`.
              if (disableInputEvents && evt.type === "input") {
                self.$selection.off("input.search input.searchcheck");
                return;
              }

              var key = evt.which;

              // We can freely ignore events from modifier keys
              if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
                return;
              }

              // Tabbing will be handled during the `keydown` phase
              if (key == KEYS.TAB) {
                return;
              }

              self.handleSearch(evt);
            }
          );
        };

        /**
         * This method will transfer the tabindex attribute from the rendered
         * selection to the search box. This allows for the search box to be used as
         * the primary focus instead of the selection container.
         *
         * @private
         */
        Search.prototype._transferTabIndex = function(decorated) {
          this.$search.attr("tabindex", this.$selection.attr("tabindex"));
          this.$selection.attr("tabindex", "-1");
        };

        Search.prototype.createPlaceholder = function(decorated, placeholder) {
          this.$search.attr("placeholder", placeholder.text);
        };

        Search.prototype.update = function(decorated, data) {
          var searchHadFocus = this.$search[0] == document.activeElement;

          this.$search.attr("placeholder", "");

          decorated.call(this, data);

          this.$selection
            .find(".select2-selection__rendered")
            .append(this.$searchContainer);

          this.resizeSearch();
          if (searchHadFocus) {
            var isTagInput = this.$element.find("[data-select2-tag]").length;
            if (isTagInput) {
              // fix IE11 bug where tag input lost focus
              this.$element.focus();
            } else {
              this.$search.focus();
            }
          }
        };

        Search.prototype.handleSearch = function() {
          this.resizeSearch();

          if (!this._keyUpPrevented) {
            var input = this.$search.val();

            this.trigger("query", {
              term: input
            });
          }

          this._keyUpPrevented = false;
        };

        Search.prototype.searchRemoveChoice = function(decorated, item) {
          this.trigger("unselect", {
            data: item
          });

          this.$search.val(item.text);
          this.handleSearch();
        };

        Search.prototype.resizeSearch = function() {
          this.$search.css("width", "25px");

          var width = "";

          if (this.$search.attr("placeholder") !== "") {
            width = this.$selection
              .find(".select2-selection__rendered")
              .innerWidth();
          } else {
            var minimumWidth = this.$search.val().length + 1;

            width = minimumWidth * 0.75 + "em";
          }

          this.$search.css("width", width);
        };

        return Search;
      }
    );

    S2.define("select2/selection/eventRelay", ["jquery"], function($) {
      function EventRelay() {}

      EventRelay.prototype.bind = function(decorated, container, $container) {
        var self = this;
        var relayEvents = [
          "open",
          "opening",
          "close",
          "closing",
          "select",
          "selecting",
          "unselect",
          "unselecting",
          "clear",
          "clearing"
        ];

        var preventableEvents = [
          "opening",
          "closing",
          "selecting",
          "unselecting",
          "clearing"
        ];

        decorated.call(this, container, $container);

        container.on("*", function(name, params) {
          // Ignore events that should not be relayed
          if ($.inArray(name, relayEvents) === -1) {
            return;
          }

          // The parameters should always be an object
          params = params || {};

          // Generate the jQuery event for the Select2 event
          var evt = $.Event("select2:" + name, {
            params: params
          });

          self.$element.trigger(evt);

          // Only handle preventable events if it was one
          if ($.inArray(name, preventableEvents) === -1) {
            return;
          }

          params.prevented = evt.isDefaultPrevented();
        });
      };

      return EventRelay;
    });

    S2.define("select2/translation", ["jquery", "require"], function(
      $,
      require
    ) {
      function Translation(dict) {
        this.dict = dict || {};
      }

      Translation.prototype.all = function() {
        return this.dict;
      };

      Translation.prototype.get = function(key) {
        return this.dict[key];
      };

      Translation.prototype.extend = function(translation) {
        this.dict = $.extend({}, translation.all(), this.dict);
      };

      // Static functions

      Translation._cache = {};

      Translation.loadPath = function(path) {
        if (!(path in Translation._cache)) {
          var translations = require(path);

          Translation._cache[path] = translations;
        }

        return new Translation(Translation._cache[path]);
      };

      return Translation;
    });

    S2.define("select2/diacritics", [], function() {
      var diacritics = {
        "\u24B6": "A",
        Ａ: "A",
        À: "A",
        Á: "A",
        Â: "A",
        Ầ: "A",
        Ấ: "A",
        Ẫ: "A",
        Ẩ: "A",
        Ã: "A",
        Ā: "A",
        Ă: "A",
        Ằ: "A",
        Ắ: "A",
        Ẵ: "A",
        Ẳ: "A",
        Ȧ: "A",
        Ǡ: "A",
        Ä: "A",
        Ǟ: "A",
        Ả: "A",
        Å: "A",
        Ǻ: "A",
        Ǎ: "A",
        Ȁ: "A",
        Ȃ: "A",
        Ạ: "A",
        Ậ: "A",
        Ặ: "A",
        Ḁ: "A",
        Ą: "A",
        Ⱥ: "A",
        Ɐ: "A",
        Ꜳ: "AA",
        Æ: "AE",
        Ǽ: "AE",
        Ǣ: "AE",
        Ꜵ: "AO",
        Ꜷ: "AU",
        Ꜹ: "AV",
        Ꜻ: "AV",
        Ꜽ: "AY",
        "\u24B7": "B",
        Ｂ: "B",
        Ḃ: "B",
        Ḅ: "B",
        Ḇ: "B",
        Ƀ: "B",
        Ƃ: "B",
        Ɓ: "B",
        "\u24B8": "C",
        Ｃ: "C",
        Ć: "C",
        Ĉ: "C",
        Ċ: "C",
        Č: "C",
        Ç: "C",
        Ḉ: "C",
        Ƈ: "C",
        Ȼ: "C",
        Ꜿ: "C",
        "\u24B9": "D",
        Ｄ: "D",
        Ḋ: "D",
        Ď: "D",
        Ḍ: "D",
        Ḑ: "D",
        Ḓ: "D",
        Ḏ: "D",
        Đ: "D",
        Ƌ: "D",
        Ɗ: "D",
        Ɖ: "D",
        Ꝺ: "D",
        Ǳ: "DZ",
        Ǆ: "DZ",
        ǲ: "Dz",
        ǅ: "Dz",
        "\u24BA": "E",
        Ｅ: "E",
        È: "E",
        É: "E",
        Ê: "E",
        Ề: "E",
        Ế: "E",
        Ễ: "E",
        Ể: "E",
        Ẽ: "E",
        Ē: "E",
        Ḕ: "E",
        Ḗ: "E",
        Ĕ: "E",
        Ė: "E",
        Ë: "E",
        Ẻ: "E",
        Ě: "E",
        Ȅ: "E",
        Ȇ: "E",
        Ẹ: "E",
        Ệ: "E",
        Ȩ: "E",
        Ḝ: "E",
        Ę: "E",
        Ḙ: "E",
        Ḛ: "E",
        Ɛ: "E",
        Ǝ: "E",
        "\u24BB": "F",
        Ｆ: "F",
        Ḟ: "F",
        Ƒ: "F",
        Ꝼ: "F",
        "\u24BC": "G",
        Ｇ: "G",
        Ǵ: "G",
        Ĝ: "G",
        Ḡ: "G",
        Ğ: "G",
        Ġ: "G",
        Ǧ: "G",
        Ģ: "G",
        Ǥ: "G",
        Ɠ: "G",
        Ꞡ: "G",
        Ᵹ: "G",
        Ꝿ: "G",
        "\u24BD": "H",
        Ｈ: "H",
        Ĥ: "H",
        Ḣ: "H",
        Ḧ: "H",
        Ȟ: "H",
        Ḥ: "H",
        Ḩ: "H",
        Ḫ: "H",
        Ħ: "H",
        Ⱨ: "H",
        Ⱶ: "H",
        Ɥ: "H",
        "\u24BE": "I",
        Ｉ: "I",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ĩ: "I",
        Ī: "I",
        Ĭ: "I",
        İ: "I",
        Ï: "I",
        Ḯ: "I",
        Ỉ: "I",
        Ǐ: "I",
        Ȉ: "I",
        Ȋ: "I",
        Ị: "I",
        Į: "I",
        Ḭ: "I",
        Ɨ: "I",
        "\u24BF": "J",
        Ｊ: "J",
        Ĵ: "J",
        Ɉ: "J",
        "\u24C0": "K",
        Ｋ: "K",
        Ḱ: "K",
        Ǩ: "K",
        Ḳ: "K",
        Ķ: "K",
        Ḵ: "K",
        Ƙ: "K",
        Ⱪ: "K",
        Ꝁ: "K",
        Ꝃ: "K",
        Ꝅ: "K",
        Ꞣ: "K",
        "\u24C1": "L",
        Ｌ: "L",
        Ŀ: "L",
        Ĺ: "L",
        Ľ: "L",
        Ḷ: "L",
        Ḹ: "L",
        Ļ: "L",
        Ḽ: "L",
        Ḻ: "L",
        Ł: "L",
        Ƚ: "L",
        Ɫ: "L",
        Ⱡ: "L",
        Ꝉ: "L",
        Ꝇ: "L",
        Ꞁ: "L",
        Ǉ: "LJ",
        ǈ: "Lj",
        "\u24C2": "M",
        Ｍ: "M",
        Ḿ: "M",
        Ṁ: "M",
        Ṃ: "M",
        Ɱ: "M",
        Ɯ: "M",
        "\u24C3": "N",
        Ｎ: "N",
        Ǹ: "N",
        Ń: "N",
        Ñ: "N",
        Ṅ: "N",
        Ň: "N",
        Ṇ: "N",
        Ņ: "N",
        Ṋ: "N",
        Ṉ: "N",
        Ƞ: "N",
        Ɲ: "N",
        Ꞑ: "N",
        Ꞥ: "N",
        Ǌ: "NJ",
        ǋ: "Nj",
        "\u24C4": "O",
        Ｏ: "O",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Ồ: "O",
        Ố: "O",
        Ỗ: "O",
        Ổ: "O",
        Õ: "O",
        Ṍ: "O",
        Ȭ: "O",
        Ṏ: "O",
        Ō: "O",
        Ṑ: "O",
        Ṓ: "O",
        Ŏ: "O",
        Ȯ: "O",
        Ȱ: "O",
        Ö: "O",
        Ȫ: "O",
        Ỏ: "O",
        Ő: "O",
        Ǒ: "O",
        Ȍ: "O",
        Ȏ: "O",
        Ơ: "O",
        Ờ: "O",
        Ớ: "O",
        Ỡ: "O",
        Ở: "O",
        Ợ: "O",
        Ọ: "O",
        Ộ: "O",
        Ǫ: "O",
        Ǭ: "O",
        Ø: "O",
        Ǿ: "O",
        Ɔ: "O",
        Ɵ: "O",
        Ꝋ: "O",
        Ꝍ: "O",
        Ƣ: "OI",
        Ꝏ: "OO",
        Ȣ: "OU",
        "\u24C5": "P",
        Ｐ: "P",
        Ṕ: "P",
        Ṗ: "P",
        Ƥ: "P",
        Ᵽ: "P",
        Ꝑ: "P",
        Ꝓ: "P",
        Ꝕ: "P",
        "\u24C6": "Q",
        Ｑ: "Q",
        Ꝗ: "Q",
        Ꝙ: "Q",
        Ɋ: "Q",
        "\u24C7": "R",
        Ｒ: "R",
        Ŕ: "R",
        Ṙ: "R",
        Ř: "R",
        Ȑ: "R",
        Ȓ: "R",
        Ṛ: "R",
        Ṝ: "R",
        Ŗ: "R",
        Ṟ: "R",
        Ɍ: "R",
        Ɽ: "R",
        Ꝛ: "R",
        Ꞧ: "R",
        Ꞃ: "R",
        "\u24C8": "S",
        Ｓ: "S",
        ẞ: "S",
        Ś: "S",
        Ṥ: "S",
        Ŝ: "S",
        Ṡ: "S",
        Š: "S",
        Ṧ: "S",
        Ṣ: "S",
        Ṩ: "S",
        Ș: "S",
        Ş: "S",
        Ȿ: "S",
        Ꞩ: "S",
        Ꞅ: "S",
        "\u24C9": "T",
        Ｔ: "T",
        Ṫ: "T",
        Ť: "T",
        Ṭ: "T",
        Ț: "T",
        Ţ: "T",
        Ṱ: "T",
        Ṯ: "T",
        Ŧ: "T",
        Ƭ: "T",
        Ʈ: "T",
        Ⱦ: "T",
        Ꞇ: "T",
        Ꜩ: "TZ",
        "\u24CA": "U",
        Ｕ: "U",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ũ: "U",
        Ṹ: "U",
        Ū: "U",
        Ṻ: "U",
        Ŭ: "U",
        Ü: "U",
        Ǜ: "U",
        Ǘ: "U",
        Ǖ: "U",
        Ǚ: "U",
        Ủ: "U",
        Ů: "U",
        Ű: "U",
        Ǔ: "U",
        Ȕ: "U",
        Ȗ: "U",
        Ư: "U",
        Ừ: "U",
        Ứ: "U",
        Ữ: "U",
        Ử: "U",
        Ự: "U",
        Ụ: "U",
        Ṳ: "U",
        Ų: "U",
        Ṷ: "U",
        Ṵ: "U",
        Ʉ: "U",
        "\u24CB": "V",
        Ｖ: "V",
        Ṽ: "V",
        Ṿ: "V",
        Ʋ: "V",
        Ꝟ: "V",
        Ʌ: "V",
        Ꝡ: "VY",
        "\u24CC": "W",
        Ｗ: "W",
        Ẁ: "W",
        Ẃ: "W",
        Ŵ: "W",
        Ẇ: "W",
        Ẅ: "W",
        Ẉ: "W",
        Ⱳ: "W",
        "\u24CD": "X",
        Ｘ: "X",
        Ẋ: "X",
        Ẍ: "X",
        "\u24CE": "Y",
        Ｙ: "Y",
        Ỳ: "Y",
        Ý: "Y",
        Ŷ: "Y",
        Ỹ: "Y",
        Ȳ: "Y",
        Ẏ: "Y",
        Ÿ: "Y",
        Ỷ: "Y",
        Ỵ: "Y",
        Ƴ: "Y",
        Ɏ: "Y",
        Ỿ: "Y",
        "\u24CF": "Z",
        Ｚ: "Z",
        Ź: "Z",
        Ẑ: "Z",
        Ż: "Z",
        Ž: "Z",
        Ẓ: "Z",
        Ẕ: "Z",
        Ƶ: "Z",
        Ȥ: "Z",
        Ɀ: "Z",
        Ⱬ: "Z",
        Ꝣ: "Z",
        "\u24D0": "a",
        ａ: "a",
        ẚ: "a",
        à: "a",
        á: "a",
        â: "a",
        ầ: "a",
        ấ: "a",
        ẫ: "a",
        ẩ: "a",
        ã: "a",
        ā: "a",
        ă: "a",
        ằ: "a",
        ắ: "a",
        ẵ: "a",
        ẳ: "a",
        ȧ: "a",
        ǡ: "a",
        ä: "a",
        ǟ: "a",
        ả: "a",
        å: "a",
        ǻ: "a",
        ǎ: "a",
        ȁ: "a",
        ȃ: "a",
        ạ: "a",
        ậ: "a",
        ặ: "a",
        ḁ: "a",
        ą: "a",
        ⱥ: "a",
        ɐ: "a",
        ꜳ: "aa",
        æ: "ae",
        ǽ: "ae",
        ǣ: "ae",
        ꜵ: "ao",
        ꜷ: "au",
        ꜹ: "av",
        ꜻ: "av",
        ꜽ: "ay",
        "\u24D1": "b",
        ｂ: "b",
        ḃ: "b",
        ḅ: "b",
        ḇ: "b",
        ƀ: "b",
        ƃ: "b",
        ɓ: "b",
        "\u24D2": "c",
        ｃ: "c",
        ć: "c",
        ĉ: "c",
        ċ: "c",
        č: "c",
        ç: "c",
        ḉ: "c",
        ƈ: "c",
        ȼ: "c",
        ꜿ: "c",
        ↄ: "c",
        "\u24D3": "d",
        ｄ: "d",
        ḋ: "d",
        ď: "d",
        ḍ: "d",
        ḑ: "d",
        ḓ: "d",
        ḏ: "d",
        đ: "d",
        ƌ: "d",
        ɖ: "d",
        ɗ: "d",
        ꝺ: "d",
        ǳ: "dz",
        ǆ: "dz",
        "\u24D4": "e",
        ｅ: "e",
        è: "e",
        é: "e",
        ê: "e",
        ề: "e",
        ế: "e",
        ễ: "e",
        ể: "e",
        ẽ: "e",
        ē: "e",
        ḕ: "e",
        ḗ: "e",
        ĕ: "e",
        ė: "e",
        ë: "e",
        ẻ: "e",
        ě: "e",
        ȅ: "e",
        ȇ: "e",
        ẹ: "e",
        ệ: "e",
        ȩ: "e",
        ḝ: "e",
        ę: "e",
        ḙ: "e",
        ḛ: "e",
        ɇ: "e",
        ɛ: "e",
        ǝ: "e",
        "\u24D5": "f",
        ｆ: "f",
        ḟ: "f",
        ƒ: "f",
        ꝼ: "f",
        "\u24D6": "g",
        ｇ: "g",
        ǵ: "g",
        ĝ: "g",
        ḡ: "g",
        ğ: "g",
        ġ: "g",
        ǧ: "g",
        ģ: "g",
        ǥ: "g",
        ɠ: "g",
        ꞡ: "g",
        ᵹ: "g",
        ꝿ: "g",
        "\u24D7": "h",
        ｈ: "h",
        ĥ: "h",
        ḣ: "h",
        ḧ: "h",
        ȟ: "h",
        ḥ: "h",
        ḩ: "h",
        ḫ: "h",
        ẖ: "h",
        ħ: "h",
        ⱨ: "h",
        ⱶ: "h",
        ɥ: "h",
        ƕ: "hv",
        "\u24D8": "i",
        ｉ: "i",
        ì: "i",
        í: "i",
        î: "i",
        ĩ: "i",
        ī: "i",
        ĭ: "i",
        ï: "i",
        ḯ: "i",
        ỉ: "i",
        ǐ: "i",
        ȉ: "i",
        ȋ: "i",
        ị: "i",
        į: "i",
        ḭ: "i",
        ɨ: "i",
        ı: "i",
        "\u24D9": "j",
        ｊ: "j",
        ĵ: "j",
        ǰ: "j",
        ɉ: "j",
        "\u24DA": "k",
        ｋ: "k",
        ḱ: "k",
        ǩ: "k",
        ḳ: "k",
        ķ: "k",
        ḵ: "k",
        ƙ: "k",
        ⱪ: "k",
        ꝁ: "k",
        ꝃ: "k",
        ꝅ: "k",
        ꞣ: "k",
        "\u24DB": "l",
        ｌ: "l",
        ŀ: "l",
        ĺ: "l",
        ľ: "l",
        ḷ: "l",
        ḹ: "l",
        ļ: "l",
        ḽ: "l",
        ḻ: "l",
        ſ: "l",
        ł: "l",
        ƚ: "l",
        ɫ: "l",
        ⱡ: "l",
        ꝉ: "l",
        ꞁ: "l",
        ꝇ: "l",
        ǉ: "lj",
        "\u24DC": "m",
        ｍ: "m",
        ḿ: "m",
        ṁ: "m",
        ṃ: "m",
        ɱ: "m",
        ɯ: "m",
        "\u24DD": "n",
        ｎ: "n",
        ǹ: "n",
        ń: "n",
        ñ: "n",
        ṅ: "n",
        ň: "n",
        ṇ: "n",
        ņ: "n",
        ṋ: "n",
        ṉ: "n",
        ƞ: "n",
        ɲ: "n",
        ŉ: "n",
        ꞑ: "n",
        ꞥ: "n",
        ǌ: "nj",
        "\u24DE": "o",
        ｏ: "o",
        ò: "o",
        ó: "o",
        ô: "o",
        ồ: "o",
        ố: "o",
        ỗ: "o",
        ổ: "o",
        õ: "o",
        ṍ: "o",
        ȭ: "o",
        ṏ: "o",
        ō: "o",
        ṑ: "o",
        ṓ: "o",
        ŏ: "o",
        ȯ: "o",
        ȱ: "o",
        ö: "o",
        ȫ: "o",
        ỏ: "o",
        ő: "o",
        ǒ: "o",
        ȍ: "o",
        ȏ: "o",
        ơ: "o",
        ờ: "o",
        ớ: "o",
        ỡ: "o",
        ở: "o",
        ợ: "o",
        ọ: "o",
        ộ: "o",
        ǫ: "o",
        ǭ: "o",
        ø: "o",
        ǿ: "o",
        ɔ: "o",
        ꝋ: "o",
        ꝍ: "o",
        ɵ: "o",
        ƣ: "oi",
        ȣ: "ou",
        ꝏ: "oo",
        "\u24DF": "p",
        ｐ: "p",
        ṕ: "p",
        ṗ: "p",
        ƥ: "p",
        ᵽ: "p",
        ꝑ: "p",
        ꝓ: "p",
        ꝕ: "p",
        "\u24E0": "q",
        ｑ: "q",
        ɋ: "q",
        ꝗ: "q",
        ꝙ: "q",
        "\u24E1": "r",
        ｒ: "r",
        ŕ: "r",
        ṙ: "r",
        ř: "r",
        ȑ: "r",
        ȓ: "r",
        ṛ: "r",
        ṝ: "r",
        ŗ: "r",
        ṟ: "r",
        ɍ: "r",
        ɽ: "r",
        ꝛ: "r",
        ꞧ: "r",
        ꞃ: "r",
        "\u24E2": "s",
        ｓ: "s",
        ß: "s",
        ś: "s",
        ṥ: "s",
        ŝ: "s",
        ṡ: "s",
        š: "s",
        ṧ: "s",
        ṣ: "s",
        ṩ: "s",
        ș: "s",
        ş: "s",
        ȿ: "s",
        ꞩ: "s",
        ꞅ: "s",
        ẛ: "s",
        "\u24E3": "t",
        ｔ: "t",
        ṫ: "t",
        ẗ: "t",
        ť: "t",
        ṭ: "t",
        ț: "t",
        ţ: "t",
        ṱ: "t",
        ṯ: "t",
        ŧ: "t",
        ƭ: "t",
        ʈ: "t",
        ⱦ: "t",
        ꞇ: "t",
        ꜩ: "tz",
        "\u24E4": "u",
        ｕ: "u",
        ù: "u",
        ú: "u",
        û: "u",
        ũ: "u",
        ṹ: "u",
        ū: "u",
        ṻ: "u",
        ŭ: "u",
        ü: "u",
        ǜ: "u",
        ǘ: "u",
        ǖ: "u",
        ǚ: "u",
        ủ: "u",
        ů: "u",
        ű: "u",
        ǔ: "u",
        ȕ: "u",
        ȗ: "u",
        ư: "u",
        ừ: "u",
        ứ: "u",
        ữ: "u",
        ử: "u",
        ự: "u",
        ụ: "u",
        ṳ: "u",
        ų: "u",
        ṷ: "u",
        ṵ: "u",
        ʉ: "u",
        "\u24E5": "v",
        ｖ: "v",
        ṽ: "v",
        ṿ: "v",
        ʋ: "v",
        ꝟ: "v",
        ʌ: "v",
        ꝡ: "vy",
        "\u24E6": "w",
        ｗ: "w",
        ẁ: "w",
        ẃ: "w",
        ŵ: "w",
        ẇ: "w",
        ẅ: "w",
        ẘ: "w",
        ẉ: "w",
        ⱳ: "w",
        "\u24E7": "x",
        ｘ: "x",
        ẋ: "x",
        ẍ: "x",
        "\u24E8": "y",
        ｙ: "y",
        ỳ: "y",
        ý: "y",
        ŷ: "y",
        ỹ: "y",
        ȳ: "y",
        ẏ: "y",
        ÿ: "y",
        ỷ: "y",
        ẙ: "y",
        ỵ: "y",
        ƴ: "y",
        ɏ: "y",
        ỿ: "y",
        "\u24E9": "z",
        ｚ: "z",
        ź: "z",
        ẑ: "z",
        ż: "z",
        ž: "z",
        ẓ: "z",
        ẕ: "z",
        ƶ: "z",
        ȥ: "z",
        ɀ: "z",
        ⱬ: "z",
        ꝣ: "z",
        Ά: "\u0391",
        Έ: "\u0395",
        Ή: "\u0397",
        Ί: "\u0399",
        Ϊ: "\u0399",
        Ό: "\u039F",
        Ύ: "\u03A5",
        Ϋ: "\u03A5",
        Ώ: "\u03A9",
        ά: "\u03B1",
        έ: "\u03B5",
        ή: "\u03B7",
        ί: "\u03B9",
        ϊ: "\u03B9",
        ΐ: "\u03B9",
        ό: "\u03BF",
        ύ: "\u03C5",
        ϋ: "\u03C5",
        ΰ: "\u03C5",
        ω: "\u03C9",
        ς: "\u03C3"
      };

      return diacritics;
    });

    S2.define("select2/data/base", ["../utils"], function(Utils) {
      function BaseAdapter($element, options) {
        BaseAdapter.__super__.constructor.call(this);
      }

      Utils.Extend(BaseAdapter, Utils.Observable);

      BaseAdapter.prototype.current = function(callback) {
        throw new Error(
          "The `current` method must be defined in child classes."
        );
      };

      BaseAdapter.prototype.query = function(params, callback) {
        throw new Error("The `query` method must be defined in child classes.");
      };

      BaseAdapter.prototype.bind = function(container, $container) {
        // Can be implemented in subclasses
      };

      BaseAdapter.prototype.destroy = function() {
        // Can be implemented in subclasses
      };

      BaseAdapter.prototype.generateResultId = function(container, data) {
        var id = container.id + "-result-";

        id += Utils.generateChars(4);

        if (data.id != null) {
          id += "-" + data.id.toString();
        } else {
          id += "-" + Utils.generateChars(4);
        }
        return id;
      };

      return BaseAdapter;
    });

    S2.define("select2/data/select", ["./base", "../utils", "jquery"], function(
      BaseAdapter,
      Utils,
      $
    ) {
      function SelectAdapter($element, options) {
        this.$element = $element;
        this.options = options;

        SelectAdapter.__super__.constructor.call(this);
      }

      Utils.Extend(SelectAdapter, BaseAdapter);

      SelectAdapter.prototype.current = function(callback) {
        var data = [];
        var self = this;

        this.$element.find(":selected").each(function() {
          var $option = $(this);

          var option = self.item($option);

          data.push(option);
        });

        callback(data);
      };

      SelectAdapter.prototype.select = function(data) {
        var self = this;

        data.selected = true;

        // If data.element is a DOM node, use it instead
        if ($(data.element).is("option")) {
          data.element.selected = true;

          this.$element.trigger("change");

          return;
        }

        if (this.$element.prop("multiple")) {
          this.current(function(currentData) {
            var val = [];

            data = [data];
            data.push.apply(data, currentData);

            for (var d = 0; d < data.length; d++) {
              var id = data[d].id;

              if ($.inArray(id, val) === -1) {
                val.push(id);
              }
            }

            self.$element.val(val);
            self.$element.trigger("change");
          });
        } else {
          var val = data.id;

          this.$element.val(val);
          this.$element.trigger("change");
        }
      };

      SelectAdapter.prototype.unselect = function(data) {
        var self = this;

        if (!this.$element.prop("multiple")) {
          return;
        }

        data.selected = false;

        if ($(data.element).is("option")) {
          data.element.selected = false;

          this.$element.trigger("change");

          return;
        }

        this.current(function(currentData) {
          var val = [];

          for (var d = 0; d < currentData.length; d++) {
            var id = currentData[d].id;

            if (id !== data.id && $.inArray(id, val) === -1) {
              val.push(id);
            }
          }

          self.$element.val(val);

          self.$element.trigger("change");
        });
      };

      SelectAdapter.prototype.bind = function(container, $container) {
        var self = this;

        this.container = container;

        container.on("select", function(params) {
          self.select(params.data);
        });

        container.on("unselect", function(params) {
          self.unselect(params.data);
        });
      };

      SelectAdapter.prototype.destroy = function() {
        // Remove anything added to child elements
        this.$element.find("*").each(function() {
          // Remove any custom data set by Select2
          Utils.RemoveData(this);
        });
      };

      SelectAdapter.prototype.query = function(params, callback) {
        var data = [];
        var self = this;

        var $options = this.$element.children();

        $options.each(function() {
          var $option = $(this);

          if (!$option.is("option") && !$option.is("optgroup")) {
            return;
          }

          var option = self.item($option);

          var matches = self.matches(params, option);

          if (matches !== null) {
            data.push(matches);
          }
        });

        callback({
          results: data
        });
      };

      SelectAdapter.prototype.addOptions = function($options) {
        Utils.appendMany(this.$element, $options);
      };

      SelectAdapter.prototype.option = function(data) {
        var option;

        if (data.children) {
          option = document.createElement("optgroup");
          option.label = data.text;
        } else {
          option = document.createElement("option");

          if (option.textContent !== undefined) {
            option.textContent = data.text;
          } else {
            option.innerText = data.text;
          }
        }

        if (data.id !== undefined) {
          option.value = data.id;
        }

        if (data.disabled) {
          option.disabled = true;
        }

        if (data.selected) {
          option.selected = true;
        }

        if (data.title) {
          option.title = data.title;
        }

        var $option = $(option);

        var normalizedData = this._normalizeItem(data);
        normalizedData.element = option;

        // Override the option's data with the combined data
        Utils.StoreData(option, "data", normalizedData);

        return $option;
      };

      SelectAdapter.prototype.item = function($option) {
        var data = {};

        data = Utils.GetData($option[0], "data");

        if (data != null) {
          return data;
        }

        if ($option.is("option")) {
          data = {
            id: $option.val(),
            text: $option.text(),
            disabled: $option.prop("disabled"),
            selected: $option.prop("selected"),
            title: $option.prop("title")
          };
        } else if ($option.is("optgroup")) {
          data = {
            text: $option.prop("label"),
            children: [],
            title: $option.prop("title")
          };

          var $children = $option.children("option");
          var children = [];

          for (var c = 0; c < $children.length; c++) {
            var $child = $($children[c]);

            var child = this.item($child);

            children.push(child);
          }

          data.children = children;
        }

        data = this._normalizeItem(data);
        data.element = $option[0];

        Utils.StoreData($option[0], "data", data);

        return data;
      };

      SelectAdapter.prototype._normalizeItem = function(item) {
        if (item !== Object(item)) {
          item = {
            id: item,
            text: item
          };
        }

        item = $.extend(
          {},
          {
            text: ""
          },
          item
        );

        var defaults = {
          selected: false,
          disabled: false
        };

        if (item.id != null) {
          item.id = item.id.toString();
        }

        if (item.text != null) {
          item.text = item.text.toString();
        }

        if (item._resultId == null && item.id && this.container != null) {
          item._resultId = this.generateResultId(this.container, item);
        }

        return $.extend({}, defaults, item);
      };

      SelectAdapter.prototype.matches = function(params, data) {
        var matcher = this.options.get("matcher");

        return matcher(params, data);
      };

      return SelectAdapter;
    });

    S2.define(
      "select2/data/array",
      ["./select", "../utils", "jquery"],
      function(SelectAdapter, Utils, $) {
        function ArrayAdapter($element, options) {
          var data = options.get("data") || [];

          ArrayAdapter.__super__.constructor.call(this, $element, options);

          this.addOptions(this.convertToOptions(data));
        }

        Utils.Extend(ArrayAdapter, SelectAdapter);

        ArrayAdapter.prototype.select = function(data) {
          var $option = this.$element.find("option").filter(function(i, elm) {
            return elm.value == data.id.toString();
          });

          if ($option.length === 0) {
            $option = this.option(data);

            this.addOptions($option);
          }

          ArrayAdapter.__super__.select.call(this, data);
        };

        ArrayAdapter.prototype.convertToOptions = function(data) {
          var self = this;

          var $existing = this.$element.find("option");
          var existingIds = $existing
            .map(function() {
              return self.item($(this)).id;
            })
            .get();

          var $options = [];

          // Filter out all items except for the one passed in the argument
          function onlyItem(item) {
            return function() {
              return $(this).val() == item.id;
            };
          }

          for (var d = 0; d < data.length; d++) {
            var item = this._normalizeItem(data[d]);

            // Skip items which were pre-loaded, only merge the data
            if ($.inArray(item.id, existingIds) >= 0) {
              var $existingOption = $existing.filter(onlyItem(item));

              var existingData = this.item($existingOption);
              var newData = $.extend(true, {}, item, existingData);

              var $newOption = this.option(newData);

              $existingOption.replaceWith($newOption);

              continue;
            }

            var $option = this.option(item);

            if (item.children) {
              var $children = this.convertToOptions(item.children);

              Utils.appendMany($option, $children);
            }

            $options.push($option);
          }

          return $options;
        };

        return ArrayAdapter;
      }
    );

    S2.define("select2/data/ajax", ["./array", "../utils", "jquery"], function(
      ArrayAdapter,
      Utils,
      $
    ) {
      function AjaxAdapter($element, options) {
        this.ajaxOptions = this._applyDefaults(options.get("ajax"));

        if (this.ajaxOptions.processResults != null) {
          this.processResults = this.ajaxOptions.processResults;
        }

        AjaxAdapter.__super__.constructor.call(this, $element, options);
      }

      Utils.Extend(AjaxAdapter, ArrayAdapter);

      AjaxAdapter.prototype._applyDefaults = function(options) {
        var defaults = {
          data: function(params) {
            return $.extend({}, params, {
              q: params.term
            });
          },
          transport: function(params, success, failure) {
            var $request = $.ajax(params);

            $request.then(success);
            $request.fail(failure);

            return $request;
          }
        };

        return $.extend({}, defaults, options, true);
      };

      AjaxAdapter.prototype.processResults = function(results) {
        return results;
      };

      AjaxAdapter.prototype.query = function(params, callback) {
        var matches = [];
        var self = this;

        if (this._request != null) {
          // JSONP requests cannot always be aborted
          if ($.isFunction(this._request.abort)) {
            this._request.abort();
          }

          this._request = null;
        }

        var options = $.extend(
          {
            type: "GET"
          },
          this.ajaxOptions
        );

        if (typeof options.url === "function") {
          options.url = options.url.call(this.$element, params);
        }

        if (typeof options.data === "function") {
          options.data = options.data.call(this.$element, params);
        }

        function request() {
          var $request = options.transport(
            options,
            function(data) {
              var results = self.processResults(data, params);

              if (
                self.options.get("debug") &&
                window.console &&
                console.error
              ) {
                // Check to make sure that the response included a `results` key.
                if (
                  !results ||
                  !results.results ||
                  !$.isArray(results.results)
                ) {
                  console.error(
                    "Select2: The AJAX results did not return an array in the " +
                      "`results` key of the response."
                  );
                }
              }

              callback(results);
            },
            function() {
              // Attempt to detect if a request was aborted
              // Only works if the transport exposes a status property
              if (
                "status" in $request &&
                ($request.status === 0 || $request.status === "0")
              ) {
                return;
              }

              self.trigger("results:message", {
                message: "errorLoading"
              });
            }
          );

          self._request = $request;
        }

        if (this.ajaxOptions.delay && params.term != null) {
          if (this._queryTimeout) {
            window.clearTimeout(this._queryTimeout);
          }

          this._queryTimeout = window.setTimeout(
            request,
            this.ajaxOptions.delay
          );
        } else {
          request();
        }
      };

      return AjaxAdapter;
    });

    S2.define("select2/data/tags", ["jquery"], function($) {
      function Tags(decorated, $element, options) {
        var tags = options.get("tags");

        var createTag = options.get("createTag");

        if (createTag !== undefined) {
          this.createTag = createTag;
        }

        var insertTag = options.get("insertTag");

        if (insertTag !== undefined) {
          this.insertTag = insertTag;
        }

        decorated.call(this, $element, options);

        if ($.isArray(tags)) {
          for (var t = 0; t < tags.length; t++) {
            var tag = tags[t];
            var item = this._normalizeItem(tag);

            var $option = this.option(item);

            this.$element.append($option);
          }
        }
      }

      Tags.prototype.query = function(decorated, params, callback) {
        var self = this;

        this._removeOldTags();

        if (params.term == null || params.page != null) {
          decorated.call(this, params, callback);
          return;
        }

        function wrapper(obj, child) {
          var data = obj.results;

          for (var i = 0; i < data.length; i++) {
            var option = data[i];

            var checkChildren =
              option.children != null &&
              !wrapper(
                {
                  results: option.children
                },
                true
              );

            var optionText = (option.text || "").toUpperCase();
            var paramsTerm = (params.term || "").toUpperCase();

            var checkText = optionText === paramsTerm;

            if (checkText || checkChildren) {
              if (child) {
                return false;
              }

              obj.data = data;
              callback(obj);

              return;
            }
          }

          if (child) {
            return true;
          }

          var tag = self.createTag(params);

          if (tag != null) {
            var $option = self.option(tag);
            $option.attr("data-select2-tag", true);

            self.addOptions([$option]);

            self.insertTag(data, tag);
          }

          obj.results = data;

          callback(obj);
        }

        decorated.call(this, params, wrapper);
      };

      Tags.prototype.createTag = function(decorated, params) {
        var term = $.trim(params.term);

        if (term === "") {
          return null;
        }

        return {
          id: term,
          text: term
        };
      };

      Tags.prototype.insertTag = function(_, data, tag) {
        data.unshift(tag);
      };

      Tags.prototype._removeOldTags = function(_) {
        var tag = this._lastTag;

        var $options = this.$element.find("option[data-select2-tag]");

        $options.each(function() {
          if (this.selected) {
            return;
          }

          $(this).remove();
        });
      };

      return Tags;
    });

    S2.define("select2/data/tokenizer", ["jquery"], function($) {
      function Tokenizer(decorated, $element, options) {
        var tokenizer = options.get("tokenizer");

        if (tokenizer !== undefined) {
          this.tokenizer = tokenizer;
        }

        decorated.call(this, $element, options);
      }

      Tokenizer.prototype.bind = function(decorated, container, $container) {
        decorated.call(this, container, $container);

        this.$search =
          container.dropdown.$search ||
          container.selection.$search ||
          $container.find(".select2-search__field");
      };

      Tokenizer.prototype.query = function(decorated, params, callback) {
        var self = this;

        function createAndSelect(data) {
          // Normalize the data object so we can use it for checks
          var item = self._normalizeItem(data);

          // Check if the data object already exists as a tag
          // Select it if it doesn't
          var $existingOptions = self.$element
            .find("option")
            .filter(function() {
              return $(this).val() === item.id;
            });

          // If an existing option wasn't found for it, create the option
          if (!$existingOptions.length) {
            var $option = self.option(item);
            $option.attr("data-select2-tag", true);

            self._removeOldTags();
            self.addOptions([$option]);
          }

          // Select the item, now that we know there is an option for it
          select(item);
        }

        function select(data) {
          self.trigger("select", {
            data: data
          });
        }

        params.term = params.term || "";

        var tokenData = this.tokenizer(params, this.options, createAndSelect);

        if (tokenData.term !== params.term) {
          // Replace the search term if we have the search box
          if (this.$search.length) {
            this.$search.val(tokenData.term);
            this.$search.focus();
          }

          params.term = tokenData.term;
        }

        decorated.call(this, params, callback);
      };

      Tokenizer.prototype.tokenizer = function(_, params, options, callback) {
        var separators = options.get("tokenSeparators") || [];
        var term = params.term;
        var i = 0;

        var createTag =
          this.createTag ||
          function(params) {
            return {
              id: params.term,
              text: params.term
            };
          };

        while (i < term.length) {
          var termChar = term[i];

          if ($.inArray(termChar, separators) === -1) {
            i++;

            continue;
          }

          var part = term.substr(0, i);
          var partParams = $.extend({}, params, {
            term: part
          });

          var data = createTag(partParams);

          if (data == null) {
            i++;
            continue;
          }

          callback(data);

          // Reset the term to not include the tokenized portion
          term = term.substr(i + 1) || "";
          i = 0;
        }

        return {
          term: term
        };
      };

      return Tokenizer;
    });

    S2.define("select2/data/minimumInputLength", [], function() {
      function MinimumInputLength(decorated, $e, options) {
        this.minimumInputLength = options.get("minimumInputLength");

        decorated.call(this, $e, options);
      }

      MinimumInputLength.prototype.query = function(
        decorated,
        params,
        callback
      ) {
        params.term = params.term || "";

        if (params.term.length < this.minimumInputLength) {
          this.trigger("results:message", {
            message: "inputTooShort",
            args: {
              minimum: this.minimumInputLength,
              input: params.term,
              params: params
            }
          });

          return;
        }

        decorated.call(this, params, callback);
      };

      return MinimumInputLength;
    });

    S2.define("select2/data/maximumInputLength", [], function() {
      function MaximumInputLength(decorated, $e, options) {
        this.maximumInputLength = options.get("maximumInputLength");

        decorated.call(this, $e, options);
      }

      MaximumInputLength.prototype.query = function(
        decorated,
        params,
        callback
      ) {
        params.term = params.term || "";

        if (
          this.maximumInputLength > 0 &&
          params.term.length > this.maximumInputLength
        ) {
          this.trigger("results:message", {
            message: "inputTooLong",
            args: {
              maximum: this.maximumInputLength,
              input: params.term,
              params: params
            }
          });

          return;
        }

        decorated.call(this, params, callback);
      };

      return MaximumInputLength;
    });

    S2.define("select2/data/maximumSelectionLength", [], function() {
      function MaximumSelectionLength(decorated, $e, options) {
        this.maximumSelectionLength = options.get("maximumSelectionLength");

        decorated.call(this, $e, options);
      }

      MaximumSelectionLength.prototype.query = function(
        decorated,
        params,
        callback
      ) {
        var self = this;

        this.current(function(currentData) {
          var count = currentData != null ? currentData.length : 0;
          if (
            self.maximumSelectionLength > 0 &&
            count >= self.maximumSelectionLength
          ) {
            self.trigger("results:message", {
              message: "maximumSelected",
              args: {
                maximum: self.maximumSelectionLength
              }
            });
            return;
          }
          decorated.call(self, params, callback);
        });
      };

      return MaximumSelectionLength;
    });

    S2.define("select2/dropdown", ["jquery", "./utils"], function($, Utils) {
      function Dropdown($element, options) {
        this.$element = $element;
        this.options = options;

        Dropdown.__super__.constructor.call(this);
      }

      Utils.Extend(Dropdown, Utils.Observable);

      Dropdown.prototype.render = function() {
        var $dropdown = $(
          '<span class="select2-dropdown">' +
            '<span class="select2-results"></span>' +
            "</span>"
        );

        $dropdown.attr("dir", this.options.get("dir"));

        this.$dropdown = $dropdown;

        return $dropdown;
      };

      Dropdown.prototype.bind = function() {
        // Should be implemented in subclasses
      };

      Dropdown.prototype.position = function($dropdown, $container) {
        // Should be implmented in subclasses
      };

      Dropdown.prototype.destroy = function() {
        // Remove the dropdown from the DOM
        this.$dropdown.remove();
      };

      return Dropdown;
    });

    S2.define("select2/dropdown/search", ["jquery", "../utils"], function(
      $,
      Utils
    ) {
      function Search() {}

      Search.prototype.render = function(decorated) {
        var $rendered = decorated.call(this);

        var $search = $(
          '<span class="select2-search select2-search--dropdown">' +
            '<input class="select2-search__field" type="search" tabindex="-1"' +
            ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
            ' spellcheck="false" role="textbox" />' +
            "</span>"
        );

        this.$searchContainer = $search;
        this.$search = $search.find("input");

        $rendered.prepend($search);

        return $rendered;
      };

      Search.prototype.bind = function(decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        this.$search.on("keydown", function(evt) {
          self.trigger("keypress", evt);

          self._keyUpPrevented = evt.isDefaultPrevented();
        });

        // Workaround for browsers which do not support the `input` event
        // This will prevent double-triggering of events for browsers which support
        // both the `keyup` and `input` events.
        this.$search.on("input", function(evt) {
          // Unbind the duplicated `keyup` event
          $(this).off("keyup");
        });

        this.$search.on("keyup input", function(evt) {
          self.handleSearch(evt);
        });

        container.on("open", function() {
          self.$search.attr("tabindex", 0);

          self.$search.focus();

          window.setTimeout(function() {
            self.$search.focus();
          }, 0);
        });

        container.on("close", function() {
          self.$search.attr("tabindex", -1);

          self.$search.val("");
          self.$search.blur();
        });

        container.on("focus", function() {
          if (!container.isOpen()) {
            self.$search.focus();
          }
        });

        container.on("results:all", function(params) {
          if (params.query.term == null || params.query.term === "") {
            var showSearch = self.showSearch(params);

            if (showSearch) {
              self.$searchContainer.removeClass("select2-search--hide");
            } else {
              self.$searchContainer.addClass("select2-search--hide");
            }
          }
        });
      };

      Search.prototype.handleSearch = function(evt) {
        if (!this._keyUpPrevented) {
          var input = this.$search.val();

          this.trigger("query", {
            term: input
          });
        }

        this._keyUpPrevented = false;
      };

      Search.prototype.showSearch = function(_, params) {
        return true;
      };

      return Search;
    });

    S2.define("select2/dropdown/hidePlaceholder", [], function() {
      function HidePlaceholder(decorated, $element, options, dataAdapter) {
        this.placeholder = this.normalizePlaceholder(
          options.get("placeholder")
        );

        decorated.call(this, $element, options, dataAdapter);
      }

      HidePlaceholder.prototype.append = function(decorated, data) {
        data.results = this.removePlaceholder(data.results);

        decorated.call(this, data);
      };

      HidePlaceholder.prototype.normalizePlaceholder = function(
        _,
        placeholder
      ) {
        if (typeof placeholder === "string") {
          placeholder = {
            id: "",
            text: placeholder
          };
        }

        return placeholder;
      };

      HidePlaceholder.prototype.removePlaceholder = function(_, data) {
        var modifiedData = data.slice(0);

        for (var d = data.length - 1; d >= 0; d--) {
          var item = data[d];

          if (this.placeholder.id === item.id) {
            modifiedData.splice(d, 1);
          }
        }

        return modifiedData;
      };

      return HidePlaceholder;
    });

    S2.define("select2/dropdown/infiniteScroll", ["jquery"], function($) {
      function InfiniteScroll(decorated, $element, options, dataAdapter) {
        this.lastParams = {};

        decorated.call(this, $element, options, dataAdapter);

        this.$loadingMore = this.createLoadingMore();
        this.loading = false;
      }

      InfiniteScroll.prototype.append = function(decorated, data) {
        this.$loadingMore.remove();
        this.loading = false;

        decorated.call(this, data);

        if (this.showLoadingMore(data)) {
          this.$results.append(this.$loadingMore);
        }
      };

      InfiniteScroll.prototype.bind = function(
        decorated,
        container,
        $container
      ) {
        var self = this;

        decorated.call(this, container, $container);

        container.on("query", function(params) {
          self.lastParams = params;
          self.loading = true;
        });

        container.on("query:append", function(params) {
          self.lastParams = params;
          self.loading = true;
        });

        this.$results.on("scroll", function() {
          var isLoadMoreVisible = $.contains(
            document.documentElement,
            self.$loadingMore[0]
          );

          if (self.loading || !isLoadMoreVisible) {
            return;
          }

          var currentOffset =
            self.$results.offset().top + self.$results.outerHeight(false);
          var loadingMoreOffset =
            self.$loadingMore.offset().top +
            self.$loadingMore.outerHeight(false);

          if (currentOffset + 50 >= loadingMoreOffset) {
            self.loadMore();
          }
        });
      };

      InfiniteScroll.prototype.loadMore = function() {
        this.loading = true;

        var params = $.extend({}, { page: 1 }, this.lastParams);

        params.page++;

        this.trigger("query:append", params);
      };

      InfiniteScroll.prototype.showLoadingMore = function(_, data) {
        return data.pagination && data.pagination.more;
      };

      InfiniteScroll.prototype.createLoadingMore = function() {
        var $option = $(
          "<li " +
            'class="select2-results__option select2-results__option--load-more"' +
            'role="treeitem" aria-disabled="true"></li>'
        );

        var message = this.options.get("translations").get("loadingMore");

        $option.html(message(this.lastParams));

        return $option;
      };

      return InfiniteScroll;
    });

    S2.define("select2/dropdown/attachBody", ["jquery", "../utils"], function(
      $,
      Utils
    ) {
      function AttachBody(decorated, $element, options) {
        this.$dropdownParent =
          options.get("dropdownParent") || $(document.body);

        decorated.call(this, $element, options);
      }

      AttachBody.prototype.bind = function(decorated, container, $container) {
        var self = this;

        var setupResultsEvents = false;

        decorated.call(this, container, $container);

        container.on("open", function() {
          self._showDropdown();
          self._attachPositioningHandler(container);

          if (!setupResultsEvents) {
            setupResultsEvents = true;

            container.on("results:all", function() {
              self._positionDropdown();
              self._resizeDropdown();
            });

            container.on("results:append", function() {
              self._positionDropdown();
              self._resizeDropdown();
            });
          }
        });

        container.on("close", function() {
          self._hideDropdown();
          self._detachPositioningHandler(container);
        });

        this.$dropdownContainer.on("mousedown", function(evt) {
          evt.stopPropagation();
        });
      };

      AttachBody.prototype.destroy = function(decorated) {
        decorated.call(this);

        this.$dropdownContainer.remove();
      };

      AttachBody.prototype.position = function(
        decorated,
        $dropdown,
        $container
      ) {
        // Clone all of the container classes
        $dropdown.attr("class", $container.attr("class"));

        $dropdown.removeClass("select2");
        $dropdown.addClass("select2-container--open");

        $dropdown.css({
          position: "absolute",
          top: -999999
        });

        this.$container = $container;
      };

      AttachBody.prototype.render = function(decorated) {
        var $container = $("<span></span>");

        var $dropdown = decorated.call(this);
        $container.append($dropdown);

        this.$dropdownContainer = $container;

        return $container;
      };

      AttachBody.prototype._hideDropdown = function(decorated) {
        this.$dropdownContainer.detach();
      };

      AttachBody.prototype._attachPositioningHandler = function(
        decorated,
        container
      ) {
        var self = this;

        var scrollEvent = "scroll.select2." + container.id;
        var resizeEvent = "resize.select2." + container.id;
        var orientationEvent = "orientationchange.select2." + container.id;

        var $watchers = this.$container.parents().filter(Utils.hasScroll);
        $watchers.each(function() {
          Utils.StoreData(this, "select2-scroll-position", {
            x: $(this).scrollLeft(),
            y: $(this).scrollTop()
          });
        });

        $watchers.on(scrollEvent, function(ev) {
          var position = Utils.GetData(this, "select2-scroll-position");
          $(this).scrollTop(position.y);
        });

        $(window).on(
          scrollEvent + " " + resizeEvent + " " + orientationEvent,
          function(e) {
            self._positionDropdown();
            self._resizeDropdown();
          }
        );
      };

      AttachBody.prototype._detachPositioningHandler = function(
        decorated,
        container
      ) {
        var scrollEvent = "scroll.select2." + container.id;
        var resizeEvent = "resize.select2." + container.id;
        var orientationEvent = "orientationchange.select2." + container.id;

        var $watchers = this.$container.parents().filter(Utils.hasScroll);
        $watchers.off(scrollEvent);

        $(window).off(scrollEvent + " " + resizeEvent + " " + orientationEvent);
      };

      AttachBody.prototype._positionDropdown = function() {
        var $window = $(window);

        var isCurrentlyAbove = this.$dropdown.hasClass(
          "select2-dropdown--above"
        );
        var isCurrentlyBelow = this.$dropdown.hasClass(
          "select2-dropdown--below"
        );

        var newDirection = null;

        var offset = this.$container.offset();

        offset.bottom = offset.top + this.$container.outerHeight(false);

        var container = {
          height: this.$container.outerHeight(false)
        };

        container.top = offset.top;
        container.bottom = offset.top + container.height;

        var dropdown = {
          height: this.$dropdown.outerHeight(false)
        };

        var viewport = {
          top: $window.scrollTop(),
          bottom: $window.scrollTop() + $window.height()
        };

        var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
        var enoughRoomBelow = viewport.bottom > offset.bottom + dropdown.height;

        var css = {
          left: offset.left,
          top: container.bottom,
          overflowY: "scroll",
          height: "100%"
        };
        // Determine what the parent element is to use for calciulating the offset
        var $offsetParent = this.$dropdownParent;

        // For statically positoned elements, we need to get the element
        // that is determining the offset
        if ($offsetParent.css("position") === "static") {
          $offsetParent = $offsetParent.offsetParent();
        }

        var parentOffset = $offsetParent.offset();

        css.top -= parentOffset.top;
        css.left -= parentOffset.left;

        if (!isCurrentlyAbove && !isCurrentlyBelow) {
          newDirection = "below";
        }

        if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
          newDirection = "above";
        } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
          newDirection = "below";
        }

        if (
          newDirection == "above" ||
          (isCurrentlyAbove && newDirection !== "below")
        ) {
          css.top = container.top - parentOffset.top - dropdown.height;
        }

        if (newDirection != null) {
          this.$dropdown
            .removeClass("select2-dropdown--below select2-dropdown--above")
            .addClass("select2-dropdown--" + newDirection);
          this.$container
            .removeClass("select2-container--below select2-container--above")
            .addClass("select2-container--" + newDirection);
        }

        this.$dropdownContainer.css(css);
      };

      AttachBody.prototype._resizeDropdown = function() {
        var css = {
          width: this.$container.outerWidth(false) + "px"
        };

        if (this.options.get("dropdownAutoWidth")) {
          css.minWidth = css.width;
          css.position = "relative";
          css.width = "auto";
        }

        this.$dropdown.css(css);
      };

      AttachBody.prototype._showDropdown = function(decorated) {
        this.$dropdownContainer.appendTo(this.$dropdownParent);

        this._positionDropdown();
        this._resizeDropdown();
      };

      return AttachBody;
    });

    S2.define("select2/dropdown/minimumResultsForSearch", [], function() {
      function countResults(data) {
        var count = 0;

        for (var d = 0; d < data.length; d++) {
          var item = data[d];

          if (item.children) {
            count += countResults(item.children);
          } else {
            count++;
          }
        }

        return count;
      }

      function MinimumResultsForSearch(
        decorated,
        $element,
        options,
        dataAdapter
      ) {
        this.minimumResultsForSearch = options.get("minimumResultsForSearch");

        if (this.minimumResultsForSearch < 0) {
          this.minimumResultsForSearch = Infinity;
        }

        decorated.call(this, $element, options, dataAdapter);
      }

      MinimumResultsForSearch.prototype.showSearch = function(
        decorated,
        params
      ) {
        if (countResults(params.data.results) < this.minimumResultsForSearch) {
          return false;
        }

        return decorated.call(this, params);
      };

      return MinimumResultsForSearch;
    });

    S2.define("select2/dropdown/selectOnClose", ["../utils"], function(Utils) {
      function SelectOnClose() {}

      SelectOnClose.prototype.bind = function(
        decorated,
        container,
        $container
      ) {
        var self = this;

        decorated.call(this, container, $container);

        container.on("close", function(params) {
          self._handleSelectOnClose(params);
        });
      };

      SelectOnClose.prototype._handleSelectOnClose = function(_, params) {
        if (params && params.originalSelect2Event != null) {
          var event = params.originalSelect2Event;

          // Don't select an item if the close event was triggered from a select or
          // unselect event
          if (event._type === "select" || event._type === "unselect") {
            return;
          }
        }

        var $highlightedResults = this.getHighlightedResults();

        // Only select highlighted results
        if ($highlightedResults.length < 1) {
          return;
        }

        var data = Utils.GetData($highlightedResults[0], "data");

        // Don't re-select already selected resulte
        if (
          (data.element != null && data.element.selected) ||
          (data.element == null && data.selected)
        ) {
          return;
        }

        this.trigger("select", {
          data: data
        });
      };

      return SelectOnClose;
    });

    S2.define("select2/dropdown/closeOnSelect", [], function() {
      function CloseOnSelect() {}

      CloseOnSelect.prototype.bind = function(
        decorated,
        container,
        $container
      ) {
        var self = this;

        decorated.call(this, container, $container);

        container.on("select", function(evt) {
          self._selectTriggered(evt);
        });

        container.on("unselect", function(evt) {
          self._selectTriggered(evt);
        });
      };

      CloseOnSelect.prototype._selectTriggered = function(_, evt) {
        var originalEvent = evt.originalEvent;

        // Don't close if the control key is being held
        if (originalEvent && originalEvent.ctrlKey) {
          return;
        }

        this.trigger("close", {
          originalEvent: originalEvent,
          originalSelect2Event: evt
        });
      };

      return CloseOnSelect;
    });

    S2.define("select2/i18n/en", [], function() {
      // English
      return {
        errorLoading: function() {
          return "The results could not be loaded.";
        },
        inputTooLong: function(args) {
          var overChars = args.input.length - args.maximum;

          var message = "Please delete " + overChars + " character";

          if (overChars != 1) {
            message += "s";
          }

          return message;
        },
        inputTooShort: function(args) {
          var remainingChars = args.minimum - args.input.length;

          var message =
            "Please enter " + remainingChars + " or more characters";

          return message;
        },
        loadingMore: function() {
          return "Loading more results…";
        },
        maximumSelected: function(args) {
          var message = "You can only select " + args.maximum + " item";

          if (args.maximum != 1) {
            message += "s";
          }

          return message;
        },
        noResults: function() {
          return "No results found";
        },
        searching: function() {
          return "Searching…";
        }
      };
    });

    S2.define(
      "select2/defaults",
      [
        "jquery",
        "require",

        "./results",

        "./selection/single",
        "./selection/multiple",
        "./selection/placeholder",
        "./selection/allowClear",
        "./selection/search",
        "./selection/eventRelay",

        "./utils",
        "./translation",
        "./diacritics",

        "./data/select",
        "./data/array",
        "./data/ajax",
        "./data/tags",
        "./data/tokenizer",
        "./data/minimumInputLength",
        "./data/maximumInputLength",
        "./data/maximumSelectionLength",

        "./dropdown",
        "./dropdown/search",
        "./dropdown/hidePlaceholder",
        "./dropdown/infiniteScroll",
        "./dropdown/attachBody",
        "./dropdown/minimumResultsForSearch",
        "./dropdown/selectOnClose",
        "./dropdown/closeOnSelect",

        "./i18n/en"
      ],
      function(
        $,
        require,
        ResultsList,
        SingleSelection,
        MultipleSelection,
        Placeholder,
        AllowClear,
        SelectionSearch,
        EventRelay,
        Utils,
        Translation,
        DIACRITICS,
        SelectData,
        ArrayData,
        AjaxData,
        Tags,
        Tokenizer,
        MinimumInputLength,
        MaximumInputLength,
        MaximumSelectionLength,
        Dropdown,
        DropdownSearch,
        HidePlaceholder,
        InfiniteScroll,
        AttachBody,
        MinimumResultsForSearch,
        SelectOnClose,
        CloseOnSelect,
        EnglishTranslation
      ) {
        function Defaults() {
          this.reset();
        }

        Defaults.prototype.apply = function(options) {
          options = $.extend(true, {}, this.defaults, options);

          if (options.dataAdapter == null) {
            if (options.ajax != null) {
              options.dataAdapter = AjaxData;
            } else if (options.data != null) {
              options.dataAdapter = ArrayData;
            } else {
              options.dataAdapter = SelectData;
            }

            if (options.minimumInputLength > 0) {
              options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                MinimumInputLength
              );
            }

            if (options.maximumInputLength > 0) {
              options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                MaximumInputLength
              );
            }

            if (options.maximumSelectionLength > 0) {
              options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                MaximumSelectionLength
              );
            }

            if (options.tags) {
              options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
            }

            if (options.tokenSeparators != null || options.tokenizer != null) {
              options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                Tokenizer
              );
            }

            if (options.query != null) {
              var Query = require(options.amdBase + "compat/query");

              options.dataAdapter = Utils.Decorate(options.dataAdapter, Query);
            }

            if (options.initSelection != null) {
              var InitSelection = require(options.amdBase +
                "compat/initSelection");

              options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                InitSelection
              );
            }
          }

          if (options.resultsAdapter == null) {
            options.resultsAdapter = ResultsList;

            if (options.ajax != null) {
              options.resultsAdapter = Utils.Decorate(
                options.resultsAdapter,
                InfiniteScroll
              );
            }

            if (options.placeholder != null) {
              options.resultsAdapter = Utils.Decorate(
                options.resultsAdapter,
                HidePlaceholder
              );
            }

            if (options.selectOnClose) {
              options.resultsAdapter = Utils.Decorate(
                options.resultsAdapter,
                SelectOnClose
              );
            }
          }

          if (options.dropdownAdapter == null) {
            if (options.multiple) {
              options.dropdownAdapter = Dropdown;
            } else {
              var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

              options.dropdownAdapter = SearchableDropdown;
            }

            if (options.minimumResultsForSearch !== 0) {
              options.dropdownAdapter = Utils.Decorate(
                options.dropdownAdapter,
                MinimumResultsForSearch
              );
            }

            if (options.closeOnSelect) {
              options.dropdownAdapter = Utils.Decorate(
                options.dropdownAdapter,
                CloseOnSelect
              );
            }

            if (
              options.dropdownCssClass != null ||
              options.dropdownCss != null ||
              options.adaptDropdownCssClass != null
            ) {
              var DropdownCSS = require(options.amdBase + "compat/dropdownCss");

              options.dropdownAdapter = Utils.Decorate(
                options.dropdownAdapter,
                DropdownCSS
              );
            }

            options.dropdownAdapter = Utils.Decorate(
              options.dropdownAdapter,
              AttachBody
            );
          }

          if (options.selectionAdapter == null) {
            if (options.multiple) {
              options.selectionAdapter = MultipleSelection;
            } else {
              options.selectionAdapter = SingleSelection;
            }

            // Add the placeholder mixin if a placeholder was specified
            if (options.placeholder != null) {
              options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                Placeholder
              );
            }

            if (options.allowClear) {
              options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                AllowClear
              );
            }

            if (options.multiple) {
              options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                SelectionSearch
              );
            }

            if (
              options.containerCssClass != null ||
              options.containerCss != null ||
              options.adaptContainerCssClass != null
            ) {
              var ContainerCSS = require(options.amdBase +
                "compat/containerCss");

              options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                ContainerCSS
              );
            }

            options.selectionAdapter = Utils.Decorate(
              options.selectionAdapter,
              EventRelay
            );
          }

          if (typeof options.language === "string") {
            // Check if the language is specified with a region
            if (options.language.indexOf("-") > 0) {
              // Extract the region information if it is included
              var languageParts = options.language.split("-");
              var baseLanguage = languageParts[0];

              options.language = [options.language, baseLanguage];
            } else {
              options.language = [options.language];
            }
          }

          if ($.isArray(options.language)) {
            var languages = new Translation();
            options.language.push("en");

            var languageNames = options.language;

            for (var l = 0; l < languageNames.length; l++) {
              var name = languageNames[l];
              var language = {};

              try {
                // Try to load it with the original name
                language = Translation.loadPath(name);
              } catch (e) {
                try {
                  // If we couldn't load it, check if it wasn't the full path
                  name = this.defaults.amdLanguageBase + name;
                  language = Translation.loadPath(name);
                } catch (ex) {
                  // The translation could not be loaded at all. Sometimes this is
                  // because of a configuration problem, other times this can be
                  // because of how Select2 helps load all possible translation files.
                  if (options.debug && window.console && console.warn) {
                    console.warn(
                      'Select2: The language file for "' +
                        name +
                        '" could not be ' +
                        "automatically loaded. A fallback will be used instead."
                    );
                  }

                  continue;
                }
              }

              languages.extend(language);
            }

            options.translations = languages;
          } else {
            var baseTranslation = Translation.loadPath(
              this.defaults.amdLanguageBase + "en"
            );
            var customTranslation = new Translation(options.language);

            customTranslation.extend(baseTranslation);

            options.translations = customTranslation;
          }

          return options;
        };

        Defaults.prototype.reset = function() {
          function stripDiacritics(text) {
            // Used 'uni range + named function' from http://jsperf.com/diacritics/18
            function match(a) {
              return DIACRITICS[a] || a;
            }

            return text.replace(/[^\u0000-\u007E]/g, match);
          }

          function matcher(params, data) {
            // Always return the object if there is nothing to compare
            if ($.trim(params.term) === "") {
              return data;
            }

            // Do a recursive check for options with children
            if (data.children && data.children.length > 0) {
              // Clone the data object if there are children
              // This is required as we modify the object to remove any non-matches
              var match = $.extend(true, {}, data);

              // Check each child of the option
              for (var c = data.children.length - 1; c >= 0; c--) {
                var child = data.children[c];

                var matches = matcher(params, child);

                // If there wasn't a match, remove the object in the array
                if (matches == null) {
                  match.children.splice(c, 1);
                }
              }

              // If any children matched, return the new object
              if (match.children.length > 0) {
                return match;
              }

              // If there were no matching children, check just the plain object
              return matcher(params, match);
            }

            var original = stripDiacritics(data.text).toUpperCase();
            var term = stripDiacritics(params.term).toUpperCase();

            // Check if the text contains the term
            if (original.indexOf(term) > -1) {
              return data;
            }

            // If it doesn't contain the term, don't return anything
            return null;
          }

          this.defaults = {
            amdBase: "./",
            amdLanguageBase: "./i18n/",
            closeOnSelect: true,
            debug: false,
            dropdownAutoWidth: false,
            escapeMarkup: Utils.escapeMarkup,
            language: EnglishTranslation,
            matcher: matcher,
            minimumInputLength: 0,
            maximumInputLength: 0,
            maximumSelectionLength: 0,
            minimumResultsForSearch: 0,
            selectOnClose: false,
            sorter: function(data) {
              return data;
            },
            templateResult: function(result) {
              return result.text;
            },
            templateSelection: function(selection) {
              return selection.text;
            },
            theme: "default",
            width: "resolve"
          };
        };

        Defaults.prototype.set = function(key, value) {
          var camelKey = $.camelCase(key);

          var data = {};
          data[camelKey] = value;

          var convertedData = Utils._convertData(data);

          $.extend(true, this.defaults, convertedData);
        };

        var defaults = new Defaults();

        return defaults;
      }
    );

    S2.define(
      "select2/options",
      ["require", "jquery", "./defaults", "./utils"],
      function(require, $, Defaults, Utils) {
        function Options(options, $element) {
          this.options = options;

          if ($element != null) {
            this.fromElement($element);
          }

          this.options = Defaults.apply(this.options);

          if ($element && $element.is("input")) {
            var InputCompat = require(this.get("amdBase") + "compat/inputData");

            this.options.dataAdapter = Utils.Decorate(
              this.options.dataAdapter,
              InputCompat
            );
          }
        }

        Options.prototype.fromElement = function($e) {
          var excludedData = ["select2"];

          if (this.options.multiple == null) {
            this.options.multiple = $e.prop("multiple");
          }

          if (this.options.disabled == null) {
            this.options.disabled = $e.prop("disabled");
          }

          if (this.options.language == null) {
            if ($e.prop("lang")) {
              this.options.language = $e.prop("lang").toLowerCase();
            } else if ($e.closest("[lang]").prop("lang")) {
              this.options.language = $e.closest("[lang]").prop("lang");
            }
          }

          if (this.options.dir == null) {
            if ($e.prop("dir")) {
              this.options.dir = $e.prop("dir");
            } else if ($e.closest("[dir]").prop("dir")) {
              this.options.dir = $e.closest("[dir]").prop("dir");
            } else {
              this.options.dir = "ltr";
            }
          }

          $e.prop("disabled", this.options.disabled);
          $e.prop("multiple", this.options.multiple);

          if (Utils.GetData($e[0], "select2Tags")) {
            if (this.options.debug && window.console && console.warn) {
              console.warn(
                "Select2: The `data-select2-tags` attribute has been changed to " +
                  'use the `data-data` and `data-tags="true"` attributes and will be ' +
                  "removed in future versions of Select2."
              );
            }

            Utils.StoreData($e[0], "data", Utils.GetData($e[0], "select2Tags"));
            Utils.StoreData($e[0], "tags", true);
          }

          if (Utils.GetData($e[0], "ajaxUrl")) {
            if (this.options.debug && window.console && console.warn) {
              console.warn(
                "Select2: The `data-ajax-url` attribute has been changed to " +
                  "`data-ajax--url` and support for the old attribute will be removed" +
                  " in future versions of Select2."
              );
            }

            $e.attr("ajax--url", Utils.GetData($e[0], "ajaxUrl"));
            Utils.StoreData($e[0], "ajax-Url", Utils.GetData($e[0], "ajaxUrl"));
          }

          var dataset = {};

          // Prefer the element's `dataset` attribute if it exists
          // jQuery 1.x does not correctly handle data attributes with multiple dashes
          if (
            $.fn.jquery &&
            $.fn.jquery.substr(0, 2) == "1." &&
            $e[0].dataset
          ) {
            dataset = $.extend(true, {}, $e[0].dataset, Utils.GetData($e[0]));
          } else {
            dataset = Utils.GetData($e[0]);
          }

          var data = $.extend(true, {}, dataset);

          data = Utils._convertData(data);

          for (var key in data) {
            if ($.inArray(key, excludedData) > -1) {
              continue;
            }

            if ($.isPlainObject(this.options[key])) {
              $.extend(this.options[key], data[key]);
            } else {
              this.options[key] = data[key];
            }
          }

          return this;
        };

        Options.prototype.get = function(key) {
          return this.options[key];
        };

        Options.prototype.set = function(key, val) {
          this.options[key] = val;
        };

        return Options;
      }
    );

    S2.define(
      "select2/core",
      ["jquery", "./options", "./utils", "./keys"],
      function($, Options, Utils, KEYS) {
        var Select2 = function($element, options) {
          if (Utils.GetData($element[0], "select2") != null) {
            Utils.GetData($element[0], "select2").destroy();
          }

          this.$element = $element;

          this.id = this._generateId($element);

          options = options || {};

          this.options = new Options(options, $element);

          Select2.__super__.constructor.call(this);

          // Set up the tabindex

          var tabindex = $element.attr("tabindex") || 0;
          Utils.StoreData($element[0], "old-tabindex", tabindex);
          $element.attr("tabindex", "-1");

          // Set up containers and adapters

          var DataAdapter = this.options.get("dataAdapter");
          this.dataAdapter = new DataAdapter($element, this.options);

          var $container = this.render();

          this._placeContainer($container);

          var SelectionAdapter = this.options.get("selectionAdapter");
          this.selection = new SelectionAdapter($element, this.options);
          this.$selection = this.selection.render();

          this.selection.position(this.$selection, $container);

          var DropdownAdapter = this.options.get("dropdownAdapter");
          this.dropdown = new DropdownAdapter($element, this.options);
          this.$dropdown = this.dropdown.render();

          this.dropdown.position(this.$dropdown, $container);

          var ResultsAdapter = this.options.get("resultsAdapter");
          this.results = new ResultsAdapter(
            $element,
            this.options,
            this.dataAdapter
          );
          this.$results = this.results.render();

          this.results.position(this.$results, this.$dropdown);

          // Bind events

          var self = this;

          // Bind the container to all of the adapters
          this._bindAdapters();

          // Register any DOM event handlers
          this._registerDomEvents();

          // Register any internal event handlers
          this._registerDataEvents();
          this._registerSelectionEvents();
          this._registerDropdownEvents();
          this._registerResultsEvents();
          this._registerEvents();

          // Set the initial state
          this.dataAdapter.current(function(initialData) {
            self.trigger("selection:update", {
              data: initialData
            });
          });

          // Hide the original select
          $element.addClass("select2-hidden-accessible");
          $element.attr("aria-hidden", "true");

          // Synchronize any monitored attributes
          this._syncAttributes();

          Utils.StoreData($element[0], "select2", this);

          // Ensure backwards compatibility with $element.data('select2').
          $element.data("select2", this);
        };

        Utils.Extend(Select2, Utils.Observable);

        Select2.prototype._generateId = function($element) {
          var id = "";

          if ($element.attr("id") != null) {
            id = $element.attr("id");
          } else if ($element.attr("name") != null) {
            id = $element.attr("name") + "-" + Utils.generateChars(2);
          } else {
            id = Utils.generateChars(4);
          }

          id = id.replace(/(:|\.|\[|\]|,)/g, "");
          id = "select2-" + id;

          return id;
        };

        Select2.prototype._placeContainer = function($container) {
          $container.insertAfter(this.$element);

          var width = this._resolveWidth(
            this.$element,
            this.options.get("width")
          );

          if (width != null) {
            $container.css("width", width);
          }
        };

        Select2.prototype._resolveWidth = function($element, method) {
          var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

          if (method == "resolve") {
            var styleWidth = this._resolveWidth($element, "style");

            if (styleWidth != null) {
              return styleWidth;
            }

            return this._resolveWidth($element, "element");
          }

          if (method == "element") {
            var elementWidth = $element.outerWidth(false);

            if (elementWidth <= 0) {
              return "auto";
            }

            return elementWidth + "px";
          }

          if (method == "style") {
            var style = $element.attr("style");

            if (typeof style !== "string") {
              return null;
            }

            var attrs = style.split(";");

            for (var i = 0, l = attrs.length; i < l; i = i + 1) {
              var attr = attrs[i].replace(/\s/g, "");
              var matches = attr.match(WIDTH);

              if (matches !== null && matches.length >= 1) {
                return matches[1];
              }
            }

            return null;
          }

          return method;
        };

        Select2.prototype._bindAdapters = function() {
          this.dataAdapter.bind(this, this.$container);
          this.selection.bind(this, this.$container);

          this.dropdown.bind(this, this.$container);
          this.results.bind(this, this.$container);
        };

        Select2.prototype._registerDomEvents = function() {
          var self = this;

          this.$element.on("change.select2", function() {
            self.dataAdapter.current(function(data) {
              self.trigger("selection:update", {
                data: data
              });
            });
          });

          this.$element.on("focus.select2", function(evt) {
            self.trigger("focus", evt);
          });

          this._syncA = Utils.bind(this._syncAttributes, this);
          this._syncS = Utils.bind(this._syncSubtree, this);

          if (this.$element[0].attachEvent) {
            this.$element[0].attachEvent("onpropertychange", this._syncA);
          }

          var observer =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;
          if (observer != null) {
            this._observer = new observer(function(mutations) {
              $.each(mutations, self._syncA);
              $.each(mutations, self._syncS);
            });
            this._observer.observe(this.$element[0], {
              attributes: true,
              childList: true,
              subtree: false
            });
          } else if (this.$element[0].addEventListener) {
            this.$element[0].addEventListener(
              "DOMAttrModified",
              self._syncA,
              false
            );
            this.$element[0].addEventListener(
              "DOMNodeInserted",
              self._syncS,
              false
            );
            this.$element[0].addEventListener(
              "DOMNodeRemoved",
              self._syncS,
              false
            );
          }
        };

        Select2.prototype._registerDataEvents = function() {
          var self = this;

          this.dataAdapter.on("*", function(name, params) {
            self.trigger(name, params);
          });
        };

        Select2.prototype._registerSelectionEvents = function() {
          var self = this;
          var nonRelayEvents = ["toggle", "focus"];

          this.selection.on("toggle", function() {
            self.toggleDropdown();
          });

          this.selection.on("focus", function(params) {
            self.focus(params);
          });

          this.selection.on("*", function(name, params) {
            if ($.inArray(name, nonRelayEvents) !== -1) {
              return;
            }

            self.trigger(name, params);
          });
        };

        Select2.prototype._registerDropdownEvents = function() {
          var self = this;

          this.dropdown.on("*", function(name, params) {
            self.trigger(name, params);
          });
        };

        Select2.prototype._registerResultsEvents = function() {
          var self = this;

          this.results.on("*", function(name, params) {
            self.trigger(name, params);
          });
        };

        Select2.prototype._registerEvents = function() {
          var self = this;

          this.on("open", function() {
            self.$container.addClass("select2-container--open");
          });

          this.on("close", function() {
            self.$container.removeClass("select2-container--open");
          });

          this.on("enable", function() {
            self.$container.removeClass("select2-container--disabled");
          });

          this.on("disable", function() {
            self.$container.addClass("select2-container--disabled");
          });

          this.on("blur", function() {
            self.$container.removeClass("select2-container--focus");
          });

          this.on("query", function(params) {
            if (!self.isOpen()) {
              self.trigger("open", {});
            }

            this.dataAdapter.query(params, function(data) {
              self.trigger("results:all", {
                data: data,
                query: params
              });
            });
          });

          this.on("query:append", function(params) {
            this.dataAdapter.query(params, function(data) {
              self.trigger("results:append", {
                data: data,
                query: params
              });
            });
          });

          this.on("keypress", function(evt) {
            var key = evt.which;

            if (self.isOpen()) {
              if (
                key === KEYS.ESC ||
                key === KEYS.TAB ||
                (key === KEYS.UP && evt.altKey)
              ) {
                self.close();

                evt.preventDefault();
              } else if (key === KEYS.ENTER) {
                self.trigger("results:select", {});

                evt.preventDefault();
              } else if (key === KEYS.SPACE && evt.ctrlKey) {
                self.trigger("results:toggle", {});

                evt.preventDefault();
              } else if (key === KEYS.UP) {
                self.trigger("results:previous", {});

                evt.preventDefault();
              } else if (key === KEYS.DOWN) {
                self.trigger("results:next", {});

                evt.preventDefault();
              }
            } else {
              if (
                key === KEYS.ENTER ||
                key === KEYS.SPACE ||
                (key === KEYS.DOWN && evt.altKey)
              ) {
                self.open();

                evt.preventDefault();
              }
            }
          });
        };

        Select2.prototype._syncAttributes = function() {
          this.options.set("disabled", this.$element.prop("disabled"));

          if (this.options.get("disabled")) {
            if (this.isOpen()) {
              this.close();
            }

            this.trigger("disable", {});
          } else {
            this.trigger("enable", {});
          }
        };

        Select2.prototype._syncSubtree = function(evt, mutations) {
          var changed = false;
          var self = this;

          // Ignore any mutation events raised for elements that aren't options or
          // optgroups. This handles the case when the select element is destroyed
          if (
            evt &&
            evt.target &&
            (evt.target.nodeName !== "OPTION" &&
              evt.target.nodeName !== "OPTGROUP")
          ) {
            return;
          }

          if (!mutations) {
            // If mutation events aren't supported, then we can only assume that the
            // change affected the selections
            changed = true;
          } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
            for (var n = 0; n < mutations.addedNodes.length; n++) {
              var node = mutations.addedNodes[n];

              if (node.selected) {
                changed = true;
              }
            }
          } else if (
            mutations.removedNodes &&
            mutations.removedNodes.length > 0
          ) {
            changed = true;
          }

          // Only re-pull the data if we think there is a change
          if (changed) {
            this.dataAdapter.current(function(currentData) {
              self.trigger("selection:update", {
                data: currentData
              });
            });
          }
        };

        /**
         * Override the trigger method to automatically trigger pre-events when
         * there are events that can be prevented.
         */
        Select2.prototype.trigger = function(name, args) {
          var actualTrigger = Select2.__super__.trigger;
          var preTriggerMap = {
            open: "opening",
            close: "closing",
            select: "selecting",
            unselect: "unselecting",
            clear: "clearing"
          };

          if (args === undefined) {
            args = {};
          }

          if (name in preTriggerMap) {
            var preTriggerName = preTriggerMap[name];
            var preTriggerArgs = {
              prevented: false,
              name: name,
              args: args
            };

            actualTrigger.call(this, preTriggerName, preTriggerArgs);

            if (preTriggerArgs.prevented) {
              args.prevented = true;

              return;
            }
          }

          actualTrigger.call(this, name, args);
        };

        Select2.prototype.toggleDropdown = function() {
          if (this.options.get("disabled")) {
            return;
          }

          if (this.isOpen()) {
            this.close();
          } else {
            this.open();
          }
        };

        Select2.prototype.open = function() {
          if (this.isOpen()) {
            return;
          }

          this.trigger("query", {});
        };

        Select2.prototype.close = function() {
          if (!this.isOpen()) {
            return;
          }

          this.trigger("close", {});
        };

        Select2.prototype.isOpen = function() {
          return this.$container.hasClass("select2-container--open");
        };

        Select2.prototype.hasFocus = function() {
          return this.$container.hasClass("select2-container--focus");
        };

        Select2.prototype.focus = function(data) {
          // No need to re-trigger focus events if we are already focused
          if (this.hasFocus()) {
            return;
          }

          this.$container.addClass("select2-container--focus");
          this.trigger("focus", {});
        };

        Select2.prototype.enable = function(args) {
          if (this.options.get("debug") && window.console && console.warn) {
            console.warn(
              'Select2: The `select2("enable")` method has been deprecated and will' +
                ' be removed in later Select2 versions. Use $element.prop("disabled")' +
                " instead."
            );
          }

          if (args == null || args.length === 0) {
            args = [true];
          }

          var disabled = !args[0];

          this.$element.prop("disabled", disabled);
        };

        Select2.prototype.data = function() {
          if (
            this.options.get("debug") &&
            arguments.length > 0 &&
            window.console &&
            console.warn
          ) {
            console.warn(
              'Select2: Data can no longer be set using `select2("data")`. You ' +
                "should consider setting the value instead using `$element.val()`."
            );
          }

          var data = [];

          this.dataAdapter.current(function(currentData) {
            data = currentData;
          });

          return data;
        };

        Select2.prototype.val = function(args) {
          if (this.options.get("debug") && window.console && console.warn) {
            console.warn(
              'Select2: The `select2("val")` method has been deprecated and will be' +
                " removed in later Select2 versions. Use $element.val() instead."
            );
          }

          if (args == null || args.length === 0) {
            return this.$element.val();
          }

          var newVal = args[0];

          if ($.isArray(newVal)) {
            newVal = $.map(newVal, function(obj) {
              return obj.toString();
            });
          }

          this.$element.val(newVal).trigger("change");
        };

        Select2.prototype.destroy = function() {
          this.$container.remove();

          if (this.$element[0].detachEvent) {
            this.$element[0].detachEvent("onpropertychange", this._syncA);
          }

          if (this._observer != null) {
            this._observer.disconnect();
            this._observer = null;
          } else if (this.$element[0].removeEventListener) {
            this.$element[0].removeEventListener(
              "DOMAttrModified",
              this._syncA,
              false
            );
            this.$element[0].removeEventListener(
              "DOMNodeInserted",
              this._syncS,
              false
            );
            this.$element[0].removeEventListener(
              "DOMNodeRemoved",
              this._syncS,
              false
            );
          }

          this._syncA = null;
          this._syncS = null;

          this.$element.off(".select2");
          this.$element.attr(
            "tabindex",
            Utils.GetData(this.$element[0], "old-tabindex")
          );

          this.$element.removeClass("select2-hidden-accessible");
          this.$element.attr("aria-hidden", "false");
          Utils.RemoveData(this.$element[0]);
          this.$element.removeData("select2");

          this.dataAdapter.destroy();
          this.selection.destroy();
          this.dropdown.destroy();
          this.results.destroy();

          this.dataAdapter = null;
          this.selection = null;
          this.dropdown = null;
          this.results = null;
        };

        Select2.prototype.render = function() {
          var $container = $(
            '<span class="select2 select2-container">' +
              '<span class="selection"></span>' +
              '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
              "</span>"
          );

          $container.attr("dir", this.options.get("dir"));

          this.$container = $container;

          this.$container.addClass(
            "select2-container--" + this.options.get("theme")
          );

          Utils.StoreData($container[0], "element", this.$element);

          return $container;
        };

        return Select2;
      }
    );

    S2.define("jquery-mousewheel", ["jquery"], function($) {
      // Used to shim jQuery.mousewheel for non-full builds.
      return $;
    });

    S2.define(
      "jquery.select2",
      [
        "jquery",
        "jquery-mousewheel",

        "./select2/core",
        "./select2/defaults",
        "./select2/utils"
      ],
      function($, _, Select2, Defaults, Utils) {
        if ($.fn.select2 == null) {
          // All methods that should return the element
          var thisMethods = ["open", "close", "destroy"];

          $.fn.select2 = function(options) {
            options = options || {};

            if (typeof options === "object") {
              this.each(function() {
                var instanceOptions = $.extend(true, {}, options);

                var instance = new Select2($(this), instanceOptions);
              });

              return this;
            } else if (typeof options === "string") {
              var ret;
              var args = Array.prototype.slice.call(arguments, 1);

              this.each(function() {
                var instance = Utils.GetData(this, "select2");

                if (instance == null && window.console && console.error) {
                  console.error(
                    "The select2('" +
                      options +
                      "') method was called on an " +
                      "element that is not using Select2."
                  );
                }

                ret = instance[options].apply(instance, args);
              });

              // Check if we should be returning `this`
              if ($.inArray(options, thisMethods) > -1) {
                return this;
              }

              return ret;
            } else {
              throw new Error("Invalid arguments for Select2: " + options);
            }
          };
        }

        if ($.fn.select2.defaults == null) {
          $.fn.select2.defaults = Defaults;
        }

        return Select2;
      }
    );

    // Return the AMD loader configuration so it can be used outside of this file
    return {
      define: S2.define,
      require: S2.require
    };
  })();

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require("jquery.select2");

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var myfiltervisualD12251A49A324B589383E3A2B4A4E1F6;
            (function (myfiltervisualD12251A49A324B589383E3A2B4A4E1F6) {
                "use strict";
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                class VisualSettings extends DataViewObjectsParser {
                    constructor() {
                        super(...arguments);
                        this.dataPoint = new dataPointSettings();
                    }
                }
                myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.VisualSettings = VisualSettings;
                class dataPointSettings {
                    constructor() {
                        // Default color
                        this.defaultColor = "";
                        // Show all
                        this.showAllDataPoints = true;
                        // Fill
                        this.fill = "";
                        // Color saturation
                        this.fillRule = "";
                        // Text Size
                        this.fontSize = 12;
                    }
                }
                myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.dataPointSettings = dataPointSettings;
            })(myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 = visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 || (visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var myfiltervisualD12251A49A324B589383E3A2B4A4E1F6;
            (function (myfiltervisualD12251A49A324B589383E3A2B4A4E1F6) {
                function logExceptions() {
                    return function (target, propertyKey, descriptor) {
                        return {
                            value: function () {
                                try {
                                    return descriptor.value.apply(this, arguments);
                                }
                                catch (e) {
                                    console.error(e);
                                    throw e;
                                }
                            }
                        };
                    };
                }
                myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.logExceptions = logExceptions;
            })(myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 = visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 || (visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var myfiltervisualD12251A49A324B589383E3A2B4A4E1F6;
            (function (myfiltervisualD12251A49A324B589383E3A2B4A4E1F6) {
                "use strict";
                class Visual {
                    constructor(options) {
                        this.selectedColumns = [];
                        this.selectedValues = [];
                        console.log("Visual constructor", options);
                        this.target = options.element;
                        this.host = options.host;
                        if (typeof document !== "undefined") {
                        }
                    }
                    update(options) {
                        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                        let __this = this;
                        this.target.innerHTML = "";
                        let selectTag = document.createElement("select");
                        selectTag.setAttribute("id", "omni-search");
                        if (__this.selectedColumns.length == 0) {
                            const defaultOption = document.createElement("option");
                            selectTag.appendChild(defaultOption);
                        }
                        let arr = options.dataViews[0].categorical.categories;
                        let filteredArray = [];
                        const columnNames = options.dataViews[0].metadata.columns.map(col => col.displayName);
                        for (var index in arr) {
                            let myval = options.dataViews[0].categorical.categories[index].values;
                            let unique = [...new Set(myval)];
                            filteredArray.push(unique);
                        }
                        selectTag.appendChild(document.createElement("option"));
                        filteredArray.forEach(function (value, i) {
                            let optgroup = document.createElement("optgroup");
                            optgroup.setAttribute("label", columnNames[i]);
                            value.forEach(function (cvalue, ci) {
                                let option = document.createElement("option");
                                option.setAttribute("value", value[ci]);
                                option.setAttribute("data-parent", columnNames[i]);
                                option.innerHTML = value[ci];
                                optgroup.appendChild(option);
                            });
                            selectTag.appendChild(optgroup);
                        });
                        this.target.appendChild(selectTag);
                        $("#omni-search").on("select2:select", function (e) {
                            var idToRemove = "";
                            var selectedvalues = $("#omni-search").val();
                            // console.log("Data ", selectedvalues);
                            if (selectedvalues) {
                                var i = selectedvalues.indexOf(idToRemove);
                                if (i >= 0) {
                                    selectedvalues.splice(i, 1);
                                    $(this)
                                        .val(selectedvalues)
                                        .change();
                                }
                            }
                            var data = e.params.data;
                            if (!__this.selectedColumns.some(e => e == data.element.dataset.parent)) {
                                __this.selectedColumns.push(data.element.dataset.parent);
                                __this.selectedValues.push([data.text]);
                            }
                            else {
                                const index = __this.selectedColumns
                                    .map(e => e)
                                    .indexOf(data.element.dataset.parent);
                                __this.selectedValues[index].push(data.text);
                                console.log("inside elese");
                            }
                            console.log("All Selected", __this.selectedValues);
                            console.log("All Columns", __this.selectedColumns);
                            let new_arr = [...__this.selectedValues];
                            let a = __this.cartesianProduct(new_arr);
                            var values_p = [];
                            a.forEach(function (val1, ind1) {
                                var values_c = [];
                                val1.forEach(function (val2, ind2) {
                                    values_c.push({ value: val2 });
                                });
                                values_p.push(values_c);
                            });
                            let target = [];
                            __this.selectedColumns.forEach(function (val1, ind1) {
                                target.push({
                                    table: "_Sales Target",
                                    column: val1
                                });
                            });
                            console.log(JSON.stringify(values_p));
                            let filter = {
                                $schema: "http://powerbi.com/product/schema#tuple",
                                filterType: 6,
                                operator: "In",
                                target: target,
                                values: values_p
                            };
                            __this.host.applyJsonFilter(filter, "general", "filter", 0 /* merge */);
                        });
                        $("#omni-search").on("select2:unselect", function (e) {
                            var data = e.params.data;
                            console.log("Data to remove:- ", data);
                            __this.selectedValues.forEach(function (P, ind1) {
                                P.forEach(function (C, ind2) {
                                    if (C == data.text) {
                                        __this.selectedValues[ind1].splice(ind2, 1);
                                    }
                                    if (__this.selectedValues[ind1].length == 0) {
                                        __this.selectedValues.splice(ind1, 1);
                                        __this.selectedColumns.splice(ind1, 1);
                                    }
                                });
                            });
                            console.log("All Selected", __this.selectedValues);
                            console.log("All Columns", __this.selectedColumns);
                            if (__this.selectedColumns.length > 0) {
                                let new_arr = [...__this.selectedValues];
                                let a = __this.cartesianProduct(new_arr);
                                var values_p = [];
                                a.forEach(function (val1, ind1) {
                                    var values_c = [];
                                    val1.forEach(function (val2, ind2) {
                                        values_c.push({ value: val2 });
                                    });
                                    values_p.push(values_c);
                                });
                                let target = [];
                                __this.selectedColumns.forEach(function (val1, ind1) {
                                    target.push({
                                        table: "_Sales Target",
                                        column: val1
                                    });
                                });
                                console.log(JSON.stringify(values_p));
                                let filter = {
                                    $schema: "http://powerbi.com/product/schema#tuple",
                                    filterType: 6,
                                    operator: "In",
                                    target: target,
                                    values: values_p
                                };
                                __this.host.applyJsonFilter(filter, "general", "filter", 0 /* merge */);
                            }
                        });
                        $("#omni-search").select2({
                            placeholder: "Select Any Filter",
                            allowClear: true,
                            multiple: true
                        });
                        $("#omni-search")
                            .val([].concat.apply([], __this.selectedValues))
                            .trigger("change");
                    }
                    static parseSettings(dataView) {
                        return myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.VisualSettings.parse(dataView);
                    }
                    cartesianProduct(a) {
                        // a = array of array
                        var i, j, l, m, a1, o = [];
                        if (!a || a.length == 0)
                            return a;
                        a1 = a.splice(0, 1)[0]; // the first array of a
                        a = this.cartesianProduct(a);
                        for (i = 0, l = a1.length; i < l; i++) {
                            if (a && a.length)
                                for (j = 0, m = a.length; j < m; j++)
                                    o.push([a1[i]].concat(a[j]));
                            else
                                o.push([a1[i]]);
                        }
                        return o;
                    }
                    /**
                     * This function gets called for each of the objects defined in the capabilities files
                     * and allows you to select which of the
                     * objects and properties you want to expose to the users in the property pane.
                     *
                     */
                    enumerateObjectInstances(options) {
                        return myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.VisualSettings.enumerateObjectInstances(this.settings || myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.VisualSettings.getDefault(), options);
                    }
                }
                __decorate([
                    myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.logExceptions(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], Visual.prototype, "update", null);
                myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.Visual = Visual;
            })(myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 = visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 || (visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6_DEBUG = {
                name: 'myfiltervisualD12251A49A324B589383E3A2B4A4E1F6_DEBUG',
                displayName: 'myfiltervisual',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '2.3.0',
                create: (options) => new powerbi.extensibility.visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6.Visual(options),
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map