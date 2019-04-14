"# myfiltervisual"

changes the following to make it work

1.  in the @types/select generated a error
    error TYPESCRIPT D:/Software Development/pbi/myfiltervisual/node_modules/@types/select2/index.d.ts : (163,18) Interface 'AjaxOptions<Result, RemoteResult>' incorrectly extends interface 'Pick<JQueryAjaxSettings, "error" | "data" | "success" | "complete" | "timeout" | "jsonp" | "url" ...'.
    Types of property 'url' are incompatible.
    Type 'string | ((params: QueryOptions) => string)' is not assignable to type 'string'.
    Type '(params: QueryOptions) => string' is not assignable to type 'string'.

         so I removed the | ((params: QueryOptions) => string) in the url option and kept only string.
