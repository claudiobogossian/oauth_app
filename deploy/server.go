package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

func Log(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/static/") {
			log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		}
		handler.ServeHTTP(w, r)
	})
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if _, err := os.Stat("dist/portal/" + r.URL.Path); os.IsNotExist(err) {
		http.ServeFile(w, r, "dist/portal/index.html")
	} else {
		http.ServeFile(w, r, "dist/portal/"+r.URL.Path)
	}
}

func main() {
	file_url := "/usr/src/app/dist/portal/"

	// open and recreate file with env variables
	data, err := ioutil.ReadFile(file_url+"env.txt")
	if err != nil {
		log.Fatal(err)
	}

	new_content := strings.ReplaceAll(string(data), "URL_OAUTH", "'"+os.Getenv("URL_OAUTH")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_APM_SERVER", "'"+os.Getenv("URL_APM_SERVER")+"'")
	err = ioutil.WriteFile(file_url+"assets/env.js", []byte(new_content), 0644)
	if err != nil {
		log.Fatalln(err)
	}

	// start web app
	http.HandleFunc("/", rootHandler)

	log.Println("Aplicação iniciada com sucesso")
	http.ListenAndServe(":8080", Log(http.DefaultServeMux))
}