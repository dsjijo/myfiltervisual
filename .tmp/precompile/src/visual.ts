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

module powerbi.extensibility.visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6  {
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
module powerbi.extensibility.visual.myfiltervisualD12251A49A324B589383E3A2B4A4E1F6  {
  "use strict";
  export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    private buttonNode: HTMLElement;
    private searchNode: HTMLElement;
    private host: IVisualHost;
    private treeViewUl: HTMLElement;
    constructor(options: VisualConstructorOptions) {
      console.log("Visual constructor", options);
      this.target = options.element;
      this.updateCount = 0;
      this.host = options.host;
      if (typeof document !== "undefined") {
        const parentDiv = document.createElement("div");
        parentDiv.setAttribute("class", "demo-section k-header");
        const heading = document.createElement("h4");
        heading.innerHTML = "Omni Search";
        const label = document.createElement("label");
        label.innerHTML = "Search";
        const searchBox = document.createElement("input");
        searchBox.setAttribute("type", "text");
        searchBox.setAttribute("id", "search-term");
        this.searchNode = searchBox;
        const treeView = document.createElement("div");
        treeView.setAttribute("id", "treeview-sprites");
        this.treeViewUl = document.createElement("ul");
        this.treeViewUl.setAttribute("id", "result");
        treeView.appendChild(this.treeViewUl);
        parentDiv.appendChild(heading);
        parentDiv.appendChild(label);
        parentDiv.appendChild(searchBox);
        parentDiv.appendChild(treeView);
        this.target.appendChild(parentDiv);
      }
    }
    @logExceptions()
    public update(options: VisualUpdateOptions) {
      this.settings = Visual.parseSettings(
        options && options.dataViews && options.dataViews[0]
      );

      console.log(options);
      /*
      this.treeViewUl.innerHTML = "";
      let treeViewUL = this.treeViewUl;
      if (typeof this.textNode !== "undefined") {
        this.textNode.textContent = (this.updateCount++).toString();
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
      filteredArray.forEach(function(value, i) {
        const li_p: HTMLElement = document.createElement("li");
        li_p.setAttribute("class", "tree-item");
        const li_span: HTMLElement = document.createElement("span");
        li_span.innerHTML = columnNames[i];
        li_p.appendChild(li_span);
        const ul_c: HTMLElement = document.createElement("ul");
        value.forEach(function(cvalue, ci) {
          const li_c: HTMLElement = document.createElement("li");
          li_c.setAttribute("class", "k-out elm");
          li_c.setAttribute("parent", columnNames[i]);
          li_c.innerHTML = value[ci];
          ul_c.appendChild(li_c);
        });
        li_p.appendChild(ul_c);
        treeViewUL.appendChild(li_p);
      });

      $("#search-term").on("keyup", function() {
        // ignore if no search term
        if (
          $.trim(
            $(this)
              .val()
              .toString()
          ) == ""
        ) {
          $("#treeview-sprites li").each(function(index) {
            $(this).removeClass("k-out");
          });
          return;
        }
        var term = $(this)
          .val()
          .toString()
          .toUpperCase();
        var expression = new RegExp(term.toString(), "i");
        $("#treeview-sprites li").each(function(index) {
          var text = $(this).text();
          $(this).removeClass("k-out");
          $(this).addClass("k-out");
          if (text.search(expression) != -1) {
            $(this).toggleClass("k-out");
          }
        });
      });
*/
      //   // invoke the filter
      let __this = this.host;
      /*
      $("#treeview-sprites li.elm").on("click", function() {
        var parent = $(this).attr("parent");
        let target: IFilterColumnTarget = {
          table: "_Sales Target",
          column: parent
        };
        let values = [$(this).html()];
        let filter: IBasicFilter = new window["powerbi-models"].BasicFilter(
          target,
          "In",
          values
        );

        __this.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
      });
      */
      //   debugger;
      //   console.log(FilterType.Tuple);

      let target: ITupleFilterTarget = [
        {
          table: "_Sales Target",
          column: "Category"
        },
        {
          table: "_Sales Target",
          column: "Segement"
        }
      ];
      let values = [
        [
          {
            value: "Furniture"
          },
          {
            value: "Consumer"
          }
        ],
        [
          {
            value: "Furniture"
          },
          {
            value: "Corporate"
          }
        ]
      ];
      console.log("before");
      let filter: ITupleFilter = {
        $schema: "http://powerbi.com/product/schema#tuple",
        filterType: 6,
        operator: "In",
        target: target,
        values: values
      };
      console.log("after");
      __this.applyJsonFilter(filter, "general", "filter", FilterAction.merge);

      console.log("after 2");
    }

    private static parseSettings(dataView: DataView): VisualSettings {
      return VisualSettings.parse(dataView) as VisualSettings;
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
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
