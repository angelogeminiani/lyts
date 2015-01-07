/*
 * LY (ly framework)
 * This program is a generic framework.
 * Support: Please, contact the Author on http://www.smartfeeling.org.
 * Copyright (C) 2014  Gian Angelo Geminiani
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * 
 */

package org.ly.packages.velocity.impl.engine.loaders;

import org.apache.commons.collections.ExtendedProperties;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.apache.velocity.runtime.RuntimeServices;
import org.apache.velocity.runtime.resource.loader.FileResourceLoader;

import java.io.InputStream;

/**
 *
 * @author angelo.geminiani
 */
public class VLCFileLoader extends FileResourceLoader {

    @Override
    public boolean resourceExists(String name) {
        return super.resourceExists(name);
    }

    @Override
    public InputStream getResourceStream(String templateName) throws ResourceNotFoundException {
        return super.getResourceStream(templateName);
    }

    @Override
    public void commonInit(RuntimeServices rs, ExtendedProperties configuration) {
        super.commonInit(rs, configuration);
    }

    @Override
    public void init(ExtendedProperties configuration) {
        super.init(configuration);
    }

    

}