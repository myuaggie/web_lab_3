package service.impl;

import dao.LibraryDao;
import dao.QuestionDao;
import dao.RecordDao;
import dao.UserDao;
import model.*;
import service.AppService;

import java.io.UnsupportedEncodingException;
import java.sql.Blob;
import java.util.List;

public class AppServiceImpl implements AppService {

    private UserDao userDao;
    private QuestionDao questionDao;
    private LibraryDao libraryDao;
    private RecordDao recordDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
    public void setQuestionDao(QuestionDao questionDao){
        this.questionDao=questionDao;
    }
    public void setLibraryDao(LibraryDao libraryDao){
        this.libraryDao=libraryDao;
    }
    public void setRecordDao(RecordDao recordDao){
        this.recordDao=recordDao;
    }

//user
    public Integer addUser(User user){
        return userDao.save(user);
    }

    public void deleteUser(User user){
        userDao.delete(user);
    }

    public void updateUser(User user){
        userDao.update(user);
    }

    public User getUserById(int id){
        return userDao.getUserById(id);
    }

    public User getUserByPhone(String phone){
        return userDao.getUserByPhone(phone);
    }

    public List<User> getAllUsers(){
        return userDao.getAllUsers();
    }

//question
    public Integer addQuestion(Question question){
        return questionDao.save(question);
    }

    public void deleteQuestion(Question question){
        questionDao.delete(question);
    }

    public void updateQuestion(Question question){
        questionDao.update(question);
    }

    public Question getQuestionById(int id){
        return questionDao.getQuestionById(id);
    }

    public List<Question> getAllQuestions(){ return questionDao.getAllQuestions(); }

 //library
    public void addLibrary(UQ_Library library){
        libraryDao.save(library);
    }

    public void deleteLibrary(UQ_Library library){
        libraryDao.delete(library);
    }

    public void updateLibrary(UQ_Library library){
        libraryDao.update(library);
    }

    public UQ_Library getLibraryByKey(ULKey key){
        return libraryDao.getLibraryByKey(key);
    }

    public List<UQ_Library> getAllLibrariesById(int id){ return libraryDao.getAllLibrariesById(id); }

    public List<UQ_Library> getAllLibraries(){
        return libraryDao.getAllLibraries();
    }

//record
    public void addRecord(Record record){
        recordDao.save(record);
    }

    public void deleteRecord(Record record){
        recordDao.delete(record);
    }

    public void updateRecord(Record record){
        recordDao.update(record);
    }

    public Record getRecordByKey(URKey key){
        return recordDao.getRecordByKey(key);
    }

    public List<Record> getAllRecords(int userId,int libraryId){
        return recordDao.getAllRecords(userId,libraryId);
    }

    public Blob convertBlob(String ans) throws UnsupportedEncodingException { return recordDao.convertBlob(ans); }
}
