import { buildComponent, buildListComponent } from '../dsfr';
import { Link } from 'react-router-dom';
import { Button } from './Button';


export const TagGroup = buildListComponent('ul', 'fr-tags-group');
export const Tag = buildComponent('span', 'fr-tag');
export const TagLink = buildComponent(Link, 'fr-tag');
export const TagButton = buildComponent(Button, 'fr-tag');
