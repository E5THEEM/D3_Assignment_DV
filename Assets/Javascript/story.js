function scrollAppear()
{
    var flexitemleft = document.querySelector('.flex-item-left');
    var felxitemleftposition = flexitemleft.getBoundingClientRect().top; 
    var position = window.innerHeight;

    if(felxitemleftposition<position)
    {
        flexitemleft.classList.add('flex-item-left-appear');
    }
}

window.addEventListener('scroll',scrollAppear);