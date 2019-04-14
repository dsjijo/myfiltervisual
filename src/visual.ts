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

module powerbi.extensibility.visual {
  export function logExceptions(): MethodDecorator {
    return function(
      target: Object,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> {
      return {
        value: function() {
          try {
            return descriptor.value.apply(this, arguments);
          } catch (e) {
            console.error(e);
            throw e;
          }
        }
      };
    };
  }
}
module powerbi.extensibility.visual {
  "use strict";
  export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    private selectedColumns = [];
    private selectedValues = [];
    private host: IVisualHost;

    constructor(options: VisualConstructorOptions) {
      console.log("Visual constructor", options);
      this.target = options.element;
      this.host = options.host;
      if (typeof document !== "undefined") {
      }
    }
    @logExceptions()
    public update(options: VisualUpdateOptions) {
      this.settings = Visual.parseSettings(
        options && options.dataViews && options.dataViews[0]
      );
      let __this = this;
      this.target.innerHTML = "";
      let selectTag = document.createElement("select");
      selectTag.setAttribute("id", "omni-search");
      if (__this.selectedColumns.length == 0) {
        const defaultOption: HTMLElement = document.createElement("option");
        selectTag.appendChild(defaultOption);
      }
      let arr = options.dataViews[0].categorical.categories;
      let filteredArray = [];
      const columnNames = options.dataViews[0].metadata.columns.map(
        col => col.displayName
      );
      for (var index in arr) {
        let myval = options.dataViews[0].categorical.categories[index].values;
        let unique = [...new Set(myval)];
        filteredArray.push(unique);
      }

      selectTag.appendChild(document.createElement("option"));
      filteredArray.forEach(function(value, i) {
        let optgroup = document.createElement("optgroup");
        optgroup.setAttribute("label", columnNames[i]);
        value.forEach(function(cvalue, ci) {
          let option = document.createElement("option");
          option.setAttribute("value", value[ci]);
          option.setAttribute("data-parent", columnNames[i]);
          option.innerHTML = value[ci];
          optgroup.appendChild(option);
        });
        selectTag.appendChild(optgroup);
      });
      this.target.appendChild(selectTag);
      $("#omni-search").on("select2:select", function(e) {
        var idToRemove = "";
        var selectedvalues: any = $("#omni-search").val();
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

        if (
          !__this.selectedColumns.some(e => e == data.element.dataset.parent)
        ) {
          __this.selectedColumns.push(data.element.dataset.parent);
          __this.selectedValues.push([data.text]);
        } else {
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
        a.forEach(function(val1, ind1) {
          var values_c = [];
          val1.forEach(function(val2, ind2) {
            values_c.push({ value: val2 });
          });
          values_p.push(values_c);
        });
        let target: any = [];
        __this.selectedColumns.forEach(function(val1, ind1) {
          target.push({
            table: "_Sales Target",
            column: val1
          });
        });
        console.log(JSON.stringify(values_p));
        let filter: ITupleFilter = {
          $schema: "http://powerbi.com/product/schema#tuple",
          filterType: 6,
          operator: "In",
          target: target,
          values: values_p
        };
        __this.host.applyJsonFilter(
          filter,
          "general",
          "filter",
          FilterAction.merge
        );
      });
      $("#omni-search").on("select2:unselect", function(e) {
        var data = e.params.data;
        console.log("Data to remove:- ", data);
        __this.selectedValues.forEach(function(P, ind1) {
          P.forEach(function(C, ind2) {
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
          a.forEach(function(val1, ind1) {
            var values_c = [];
            val1.forEach(function(val2, ind2) {
              values_c.push({ value: val2 });
            });
            values_p.push(values_c);
          });
          let target: any = [];
          __this.selectedColumns.forEach(function(val1, ind1) {
            target.push({
              table: "_Sales Target",
              column: val1
            });
          });
          console.log(JSON.stringify(values_p));
          let filter: ITupleFilter = {
            $schema: "http://powerbi.com/product/schema#tuple",
            filterType: 6,
            operator: "In",
            target: target,
            values: values_p
          };
          __this.host.applyJsonFilter(
            filter,
            "general",
            "filter",
            FilterAction.merge
          );
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

    private static parseSettings(dataView: DataView): VisualSettings {
      return VisualSettings.parse(dataView) as VisualSettings;
    }
    public cartesianProduct(a) {
      // a = array of array
      var i,
        j,
        l,
        m,
        a1,
        o = [];
      if (!a || a.length == 0) return a;

      a1 = a.splice(0, 1)[0]; // the first array of a
      a = this.cartesianProduct(a);
      for (i = 0, l = a1.length; i < l; i++) {
        if (a && a.length)
          for (j = 0, m = a.length; j < m; j++) o.push([a1[i]].concat(a[j]));
        else o.push([a1[i]]);
      }
      return o;
    }
    /**
     * This function gets called for each of the objects defined in the capabilities files
     * and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(
      options: EnumerateVisualObjectInstancesOptions
    ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
      return VisualSettings.enumerateObjectInstances(
        this.settings || VisualSettings.getDefault(),
        options
      );
    }
  }
}
