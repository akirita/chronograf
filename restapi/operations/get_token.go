package operations

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	context "golang.org/x/net/context"

	middleware "github.com/go-openapi/runtime/middleware"
)

// GetTokenHandlerFunc turns a function with the right signature into a get token handler
type GetTokenHandlerFunc func(context.Context, GetTokenParams) middleware.Responder

// Handle executing the request and returning a response
func (fn GetTokenHandlerFunc) Handle(ctx context.Context, params GetTokenParams) middleware.Responder {
	return fn(ctx, params)
}

// GetTokenHandler interface for that can handle valid get token params
type GetTokenHandler interface {
	Handle(context.Context, GetTokenParams) middleware.Responder
}

// NewGetToken creates a new http.Handler for the get token operation
func NewGetToken(ctx *middleware.Context, handler GetTokenHandler) *GetToken {
	return &GetToken{Context: ctx, Handler: handler}
}

/*GetToken swagger:route GET /token getToken

Authentication token

Generates a JWT authentication token


*/
type GetToken struct {
	Context *middleware.Context
	Handler GetTokenHandler
}

func (o *GetToken) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, _ := o.Context.RouteInfo(r)
	var Params = NewGetTokenParams()

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(context.Background(), Params) // actually handle the request

	o.Context.Respond(rw, r, route.Produces, route, res)

}