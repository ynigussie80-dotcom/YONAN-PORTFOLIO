# YONAN'S PORTFOLIO

A responsive portfolio made with plain HTML, CSS, and JavaScript.

## Run locally

From this folder, start a local web server:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. The contact form uses a cross-origin form service, so test it from an HTTP-served or deployed site rather than opening the HTML file directly.

## Update the portfolio

- Edit the section content, project links, social URLs, and page metadata in `index.html`.
- Replace `profile.jpg` with your portrait, keeping that filename, or update its path in `index.html`.
- Change the email address in both the form `action` in `index.html` and `contactEmail` in `script.js` if your contact email changes.

## Contact form delivery

The contact form submits through FormSubmit to `yonan3053@gmail.com`. FormSubmit sends an activation email the first time a message is submitted to a new recipient; click its confirmation link to enable delivery. The form then displays sending, success, or fallback instructions without opening the visitor's email app.
