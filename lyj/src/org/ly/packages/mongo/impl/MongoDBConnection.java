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
package org.ly.packages.mongo.impl;

import com.mongodb.DB;
import org.json.JSONObject;
import org.ly.commons.logging.Level;
import org.ly.commons.logging.Logger;
import org.ly.commons.logging.util.LoggingUtils;
import org.ly.commons.util.FormatUtils;
import org.ly.commons.util.JsonWrapper;

/**
 * @author angelo.geminiani
 */
public class MongoDBConnection {

    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";
    private static final String HOST = "host";
    private static final String PORT = "port";
    private static final String DBNAME = "dbname";

    private final JSONObject _settings;
    private String _dbname;
    private String _username;
    private String _password;
    private String _host;
    private int _port;

    private MongoDB _mongo;

    public MongoDBConnection(final JSONObject settings) {
        _settings = settings;
        try {
            // load settings
            this.init();
            // creates database
            _mongo = new MongoDB(_host, _port);
            this.getLogger().log(Level.INFO, FormatUtils.format(
                    "MONGODB initialized on {0}:{1} {2}", _host, _port, _dbname));
        } catch (Throwable t) {
            this.getLogger().log(Level.SEVERE,
                    FormatUtils.format("ERROR INITIALIZING MONGO: {0}", t),
                    t);
        }
    }

    @Override
    public String toString() {
        final StringBuilder result = new StringBuilder();
        result.append("DBName=").append(_dbname);
        result.append(", ");
        result.append("Host=").append(_host);
        result.append(", ");
        result.append("Port=").append(_port);
        result.append(", ");
        result.append("Username=").append(_username);
        result.append(", ");
        result.append("Password=").append(_password);

        return result.toString();
    }

    public final DB getDB() throws StandardCodedException {
        return _mongo.getDB(_dbname, _username, _password);
    }
    // ------------------------------------------------------------------------
    //                      p r u b l i c
    // ------------------------------------------------------------------------

    public String getDbname() {
        return _dbname;
    }

    public void setDbname(String dbname) {
        this._dbname = dbname;
    }

    public String getUsername() {
        return _username;
    }

    public void setUsername(String username) {
        this._username = username;
    }

    public String getPassword() {
        return _password;
    }

    public void setPassword(String password) {
        this._password = password;
    }

    public String getHost() {
        return _host;
    }

    public void setHost(String host) {
        this._host = host;
    }

    public int getPort() {
        return _port;
    }

    public void setPort(int port) {
        this._port = port;
    }

    // ------------------------------------------------------------------------
    //                      p r i v a t e
    // ------------------------------------------------------------------------

    private Logger getLogger() {
        return LoggingUtils.getLogger(this);
    }

    private void init() {
        final String dbname = JsonWrapper.getString(_settings,
                DBNAME);
        final String username = JsonWrapper.getString(_settings,
                USERNAME);
        final String password = JsonWrapper.getString(_settings,
                PASSWORD);
        final String host = JsonWrapper.getString(_settings,
                HOST);
        final int port = JsonWrapper.getInt(_settings,
                PORT);
        this.setDbname(dbname);
        this.setUsername(username);
        this.setPassword(password);
        this.setHost(host);
        this.setPort(port);
    }
}