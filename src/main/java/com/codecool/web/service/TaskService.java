package com.codecool.web.service;

import com.codecool.web.model.Task;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public interface TaskService {

    List<Task> findByUserId(int userId) throws SQLException, ServiceException;

    void addTask(String name, String description, int userId)throws  SQLException, ServiceException;

    Task getTaskById(int taskId, int userId) throws SQLException, ServiceException;

    void deleteTask(int id) throws SQLException, ServiceException;

    void modifyTask(int id, String name, String description) throws SQLException, ServiceException;
}
