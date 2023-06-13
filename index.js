(function () {
    'use strict';

    let newDiv = $('<div></div>');
    const displayDiv = $('#displayDiv');
    const thumbnail = $('#thumbnail');

    async function getThumbnails() {
        const bloggers = await ajaxCall(`https://jsonplaceholder.typicode.com/users`);
        if (bloggers) {
             bloggers.map((blogger) => thumbnail.append(`<div class="col">
            <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225"
                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail"
                    preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#55595c"></rect><text x="40%" y="50%" fill="#eceeef"
                        dy=".3em">${blogger.name}</text>
                </svg>
                <div class="card-body">
                    <p class="card-text">Company: ${blogger.company.name} <br> Business: ${blogger.company.bs} <br> Specializes in: ${blogger.company.catchPhrase}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button id="${blogger.id}"type="button" class="btn btn-sm btn-outline-secondary viewPosts" >View Posts</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">Visit me at <br>${blogger.website}</button>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>`
            ));
        }
    }
    async function ajaxCall(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.error('Unable To Process Request', e);
        }
    }
    function onClick(theClass, func) {
        $(document).on('click', theClass, func)
    }
   
    onClick('.viewPosts', (event) => { loadPosts(event.target.id) });

    async function showComments(postId) {
        const comments = await ajaxCall(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (comments) {
            comments.forEach(comment => {
                newDiv.append(`<figure class="text-center comm">
                    <blockquote class="blockquote">
                        <p>${comment.body} </p>
                    </blockquote>
                    <figcaption class="blockquote-footer">
                        ${comment.name} <cite title="Source Title">${comment.email}</cite>
                    </figcaption>
                </figure>
              `)
            })
        }
    }
    async function loadPosts(id) {
        const theBlogger = await ajaxCall(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
        if (theBlogger) {
            thumbnail.hide();
            scrollToTop();
            if (displayDiv) {
                displayDiv.empty();
                displayDiv.show();
            }
            theBlogger.forEach(blog => {
                displayDiv.append(`
                <div id="blogs" class="card text-center mx-5 mb-5 ">
                 <div class="card-header headColor ">
                 </div>
                  <div class="card-body bgColor">
                   <h5 class="card-title"> ${blog.title} </h5>  
                    <p id="posts" class="card-text">${blog.body}.</p>
                     <button id="${blog.id}" class="btn btn-primary comments">Show comments</button> 
                  </div>
                   <div class="card-footer headColor text-muted">
                   </div>
                </div> `)
            })
        }
    }
    onClick('.comments', loadComments);
   
    function loadComments(event) {
        const theButton = event.target;
        const currentActive = $('.theActive');
        if (currentActive) {
            newDiv.empty();
            currentActive.text('Show comments');
            currentActive.removeClass('theActive');
        }
        if (!currentActive.is(theButton)) {
            $(theButton).addClass('theActive');
            $(theButton).before(newDiv);
            theButton.textContent = 'Hide comments';
            showComments(theButton.id);
        }
    }

    function scrollToTop() {
        $(window).scrollTop(0);
    }

    $('#home').click(() => {
        displayDiv.hide();
        thumbnail.show()
    });

    function loadHomePage() {
        getThumbnails();
    }
    loadHomePage();


})();