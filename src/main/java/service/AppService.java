package service;

import model.*;

import java.io.UnsupportedEncodingException;
import java.sql.Blob;
import java.util.List;

public interface AppService {

    public Integer addUser(User user);

    public void deleteUser(User user);

    public void updateUser(User user);

    public User getUserById(int id);

    public User getUserByPhone(String phone);

    public List<User> getAllUsers();


    public Integer addQuestion(Question question);

    public void deleteQuestion(Question question);

    public void updateQuestion(Question question);

    public Question getQuestionById(int id);

    public List<Question> getAllQuestions();


    public void addLibrary(UQ_Library library);

    public void deleteLibrary(UQ_Library library);

    public void updateLibrary(UQ_Library library);

    public UQ_Library getLibraryByKey(ULKey key);

    public List<UQ_Library> getAllLibrariesById(int id);

    public List<UQ_Library> getAllLibraries();


    public void addRecord(Record record);

    public void deleteRecord(Record record);

    public void updateRecord(Record record);

    public Record getRecordByKey(URKey key);

    public List<Record> getAllRecords(int userId,int libraryId);

    public Blob convertBlob(String ans) throws UnsupportedEncodingException;

}
