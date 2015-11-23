package app

import  (
    "fmt"
    "github.com/gorilla/mux"
    "net/http"
    "log"
)

func notFound(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "", 404)
	fmt.Fprintf(w, "Hmm... can't seem to find the page you were looking for.")
	return
}


func init() {
    r := mux.NewRouter()
    
    log.Println("entered mux")

    r.PathPrefix("/admin/").Handler(http.StripPrefix("/admin/", http.FileServer(http.Dir("./static/admin"))))
	r.PathPrefix("/admin").Handler(http.RedirectHandler("/admin/", 301))
    
    r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/home")))
    
    r.HandleFunc("/{.path:.*}", notFound)
    http.Handle("/", r)
}