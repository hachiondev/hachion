import React from 'react';
import {Link} from 'react-router-dom';
import {IoIosArrowForward} from 'react-icons/io';
import { MdArrowBackIos } from 'react-icons/md';


const Pagination=()=>{

    return(<>
    <nav aria-label='Page navigation example'>
        <ul className='pagination'>
            <li className='page-item'><Link to='#' className='page-link'><MdArrowBackIos/></Link></li>
            <li className='page-item'><Link to='#' className='page-link'>1</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>2</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>3</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>4</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>5</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>6</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>7</Link></li>
            <li className='page-item'><Link to='#' className='page-link'>8</Link></li>
            <li className='page-item'><Link to='#' className='page-link'><IoIosArrowForward/></Link></li>
        </ul>
    </nav>
    </>)

}

export default Pagination;